"use client";
import { FileUploader } from "@/components/fileUpload";
import SwitchLabel from "@/components/switchLabel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { units } from "@/data/unit";
import { unitName } from "@/lib/utils";
import ProductQuery from "@/queries/product";
import { Category, Shop } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Blocks, Loader, Package, Plus, Text, X } from "lucide-react";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  categories: Category[];
  shops: Shop[];
};

const stockSchema = z.object({
  quantity: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Quantité invalide",
  }),
  threshold: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Seuil invalide",
    }),
  shopId: z.string().min(1, "Choisir un magasin"),
  //productVariantId: z.string().min(1, "Choisir une variante de produit"),
});

const variantSchema = z.object({
  name: z
    .string({ message: "Veuillez renseigner un nom" })
    .min(2, { message: "Le nom doit comporter au moins 2 caractères" })
    .max(12, { message: "12 caractères maximum" }),
  weight: z
    .string({ message: "Veuillez renseigner le poids" })
    .refine((val) => !isNaN(Number(val)), {
      message: "Le poids doit être un nombre",
    }),
  quantity: z
    .string()
    .refine((val) => Number(val) > 0, { message: "Doit être un nombre" }),
  unit: z.string({ message: "Veuillez renseigner l'unité" }),
  status: z.boolean(),
  price: z
    .string({ message: "Veuillez renseigner un prix" })
    .refine((val) => !isNaN(Number(val)), {
      message: "Le prix doit être un nombre",
    }),
  imgUrl: z
    .any()
    .refine((file) => file instanceof File || file === undefined, {
      message: "Veuillez sélectionner un fichier valide",
    })
    .optional(),
  stock: z.array(stockSchema).min(1, {
    message: "Veuillez initialiser le stock pour un point de vente",
  }),
});

const formSchema = z.object({
  name: z
    .string({ message: "Veuillez entrer un nom" })
    .min(3, { message: "Trop court" })
    .max(15, { message: "Trop long" }),
  category: z.string({ message: "Veuillez sélectionner une catégorie" }),
  status: z.boolean(),
  description: z.string({
    message: "Veuillez renseigner une description du produit",
  }),
  variants: z
    .array(variantSchema)
    .min(1, { message: "Veuillez ajouter au moins une variante" }),
}).superRefine((data, ctx) => {
    const names = data.variants.map((v) => v.name.trim().toLowerCase());
    const duplicates = names.filter(
      (name, index) => names.indexOf(name) !== index
    );

    if (duplicates.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Les variantes doivent avoir des noms uniques. Doublon trouvé: "${duplicates[0]}"`,
        path: [`variants.${data.variants.findIndex(x=> x.name.trim().toLocaleLowerCase() === duplicates[0])}.name`],
      });
    }
  });

type FormValues = z.infer<typeof formSchema>;
type Variant = FormValues["variants"][number];
type StockItem = Variant["stock"][number];

function AddProduct({ categories, isOpen, openChange, shops }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: undefined,
      status: true,
      description: "",
      variants: [
        {
          name: undefined,
          weight: "1",
          status: true,
          quantity: "1",
          unit: "kg",
          price: "500",
          stock: [
            {
              quantity: "100",
              threshold: "20",
              shopId: undefined,
            },
          ],
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const productAction = new ProductQuery();
  const queryClient = useQueryClient();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    productAdd.mutate(values);
  };

  const productAdd = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return productAction.createWithImages({
        name: values.name,
        status: values.status,
        categoryId: Number(values.category),
        weight: 0,
        description: values.description,
        variants: values.variants.map((el) => ({
          name: el.name,
          weight: Number(el.weight),
          quantity: Number(el.quantity),
          unit: el.unit,
          status: el.status,
          price: Number(el.price),
          imgUrl: el.imgUrl,
          stock: el.stock.map((stockItem) => ({
            quantity: Number(stockItem.quantity),
            threshold: Number(stockItem.threshold),
            shopId: Number(stockItem.shopId),
          })),
        })),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"], type: "active" });
      queryClient.invalidateQueries({ queryKey: ["variants"], type: "active" });
      queryClient.invalidateQueries({ queryKey: ["stocks"], type: "active" });
      openChange(false);
    },
  });

  {
    /**Clean up the form */
  }
  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        name: "",
        category: undefined,
        status: true,
        description: "",
        variants: [
          {
            name: undefined,
            weight: "1",
            price: "500",
            status: true,
            quantity: "1",
            unit: "kg",
            stock: [
              {
                quantity: "100",
                threshold: "20",
                shopId: undefined,
              },
            ],
          },
        ],
      });
    }
  }, [isOpen, form]);

  const handleAddStock = (variantIndex: number) => {
    const variants = form.getValues("variants");
    const updatedStocks: StockItem[] = [
      ...variants[variantIndex].stock,
      { quantity: "100", threshold: "20", shopId: "1" },
    ];
    form.setValue(`variants.${variantIndex}.stock`, updatedStocks);
  };

  const handleRemoveStock = (variantIndex: number, stockIndex: number) => {
    const variants = form.getValues("variants");
    const updatedStocks: StockItem[] = variants[variantIndex].stock.filter(
      (_, idx) => idx !== stockIndex
    );
    form.setValue(`variants.${variantIndex}.stock`, updatedStocks);
  };

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent className="md:max-w-[calc(100%-3rem)] lg:max-w-[978px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{"Ajouter un produit"}</DialogTitle>
          <DialogDescription>
            {"Complétez le formulaire pour ajouter un produit"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Text size={16} />
                {"Informations générales"}
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{"Nom du Produit"}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Entrer le nom du produit"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{"Catégorie"}</FormLabel>
                      <FormControl>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="!h-10 w-auto">
                            <SelectValue placeholder="Sélectionner une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={String(cat.id)}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-2">
                      <FormLabel>{"Description"}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Description du produit"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SwitchLabel {...field} name="Statut du Produit" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex gap-2 items-center">
                <Blocks size={16} />
                {"Variantes du produit"}
              </h3>
              {fields.map((field, index) => {
                const stockFields: StockItem[] =
                  form.watch(`variants.${index}.stock`) || [];
                return (
                  <div
                    key={field.id}
                    className="p-3 rounded-sm border grid grid-cols-1 gap-4 md:grid-cols-2"
                  >
                    <div className="md:col-span-2 flex items-center justify-between flex-wrap gap-2 pb-2">
                      <span className="text-sm font-semibold px-2 py-1 bg-primary/20 rounded">{`Variante n°${index}`}</span>
                      <Button
                        variant={"delete"}
                        size={"icon"}
                        onClick={(e) => {
                          e.preventDefault();
                          remove(index);
                        }}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                    <FormField
                      control={form.control}
                      name={`variants.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{"Nom"}</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="ex. Sac, Boite" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`variants.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{"Quantité"}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="ex 10"
                              type="number"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`variants.${index}.weight`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{"Poids de la variante"}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Poids"
                                className="pr-10"
                              />
                            </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`variants.${index}.unit`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{"Unité"}</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="ex. kg" />
                              </SelectTrigger>
                              <SelectContent>
                                {units.map((x, id) => (
                                  <SelectItem key={id} value={x}>
                                    {unitName(x)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`variants.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{"Prix"}</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Prix"
                                className="pr-12"
                              />
                            </FormControl>
                            <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                              {"FCFA"}
                            </span>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="col-span-1 md:col-span-2">
                      <FormField
                        control={form.control}
                        name={`variants.${index}.imgUrl`}
                        render={({ field: { onChange, value, ...rest } }) => (
                          <FormItem>
                            <FormLabel>{"Image de la variante"}</FormLabel>
                            <FormControl>
                              <FileUploader
                                onChange={onChange}
                                value={value}
                                {...rest}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="p-3 md:col-span-2 rounded-sm border border-secondary/50 grid gap-4">
                      <h4 className="font-semibold text-lg flex items-center gap-2">
                        <Package size={16} />
                        {"Stocks"}
                      </h4>
                      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                        {stockFields.map(
                          (stockItem: StockItem, stockId: number) => (
                            <div
                              key={stockId}
                              className="p-3 rounded border grid grid-cols-1 sm:grid-cols-2 gap-3"
                            >
                              <div className="w-full sm:col-span-2 flex justify-between gap-3 items-center mb-2">
                                <span className="px-2 py-1 bg-sky-200 rounded text-sm font-medium">{`Stock n°${stockId}`}</span>
                                <Button
                                  variant={"delete"}
                                  size={"icon"}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleRemoveStock(index, stockId);
                                  }}
                                >
                                  <X size={16} />
                                </Button>
                              </div>
                              <FormField
                                control={form.control}
                                name={`variants.${index}.stock.${stockId}.quantity`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>{"Quantité Initiale"}</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="3"
                                        type="number"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`variants.${index}.stock.${stockId}.threshold`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>{"Seuil"}</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="3"
                                        type="number"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="sm:col-span-2">
                                <FormField
                                  control={form.control}
                                  name={`variants.${index}.stock.${stockId}.shopId`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>{"Point de vente"}</FormLabel>
                                      <FormControl>
                                        <Select
                                          defaultValue={field.value}
                                          onValueChange={field.onChange}
                                        >
                                          <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Sélectionner un point de vente" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {shops.map((shop) => (
                                              <SelectItem
                                                key={shop.id}
                                                value={String(shop.id)}
                                                disabled={form
                                                  .getValues("variants")
                                                  .filter(
                                                    (d) =>
                                                      d.name ===
                                                      form.getValues(
                                                        `variants.${index}.name`
                                                      )
                                                  )
                                                  .some((y) =>
                                                    y.stock.some(
                                                      (z) =>
                                                        Number(z.shopId) ===
                                                        shop.id
                                                    )
                                                  )}
                                              >
                                                {shop.name}
                                              </SelectItem>
                                            ))}
                                            {shops.length === 0 && (
                                              <SelectItem value="#" disabled>
                                                {
                                                  "Aucun point de vente enregistré"
                                                }
                                              </SelectItem>
                                            )}
                                          </SelectContent>
                                        </Select>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          )
                        )}
                      </div>
                      <Button
                        variant={"ternary"}
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddStock(index);
                        }}
                      >
                        {"Ajouter un stock"}
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                );
              })}
              <Button
                variant={"secondary"}
                className="w-full"
                onClick={(e) => {
                  e.preventDefault();
                  append({
                    name: "",
                    quantity: "1",
                    unit: "kg",
                    weight: "1",
                    price: "500",
                    status: true,
                    stock: [
                      {
                        quantity: "100",
                        threshold: "20",
                        shopId: "1",
                      },
                    ],
                  });
                }}
              >
                {"Ajouter une variante"}
                <Plus size={16} />
              </Button>
            </div>

            <DialogFooter className="mt-4">
              <Button type="submit" disabled={productAdd.isPending}>
                {productAdd.isPending && (
                  <Loader className="animate-spin" size={16} />
                )}
                {"Ajouter"}
              </Button>
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  form.reset();
                  openChange(false);
                }}
              >
                {"Annuler"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddProduct;
