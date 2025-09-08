"use client";
import { FileUploader } from "@/components/fileUpload";
import ModalLayout from "@/components/modal-layout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import RequiredStar from "@/components/ui/requiredStar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { units } from "@/data/unit";
import { fetchAll } from "@/hooks/useData";
import { formatName, unitName } from "@/lib/utils";
import ProductQuery from "@/queries/product";
import ProductVariantQuery from "@/queries/productVariant";
import ShopQuery from "@/queries/shop";
import { Shop } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader, Package, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

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

const formSchema = z.object({
  name: z
    .string({ message: "Veuillez renseigner un nom" })
    .min(2, { message: "Le nom doit comporter au moins 2 caractères" })
    .max(21, { message: "21 caractères maximum" }),
  quantity: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: "Doit être un nombre",
    })
    .refine((val) => Number(val) > 0, { message: "Doit être un nombre" }),
  unit: z.enum(units),
  weight: z
    .string({ message: "Veuillez renseigner le poids" })
    .refine((val) => !isNaN(Number(val)), {
      message: "Doit être un nombre",
    }),
  status: z.boolean(),
  price: z
    .string({ message: "Veuillez renseigner un prix" })
    .refine((val) => !isNaN(Number(val)), {
      message: "Le prix doit être un nombre",
    }),
  productId: z.string({ message: "Veuillez sélectionner le produit parent" }),
  imgUrl: z
    .custom<File>()
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Format accepté: JPG, JPEG, PNG, WEBP uniquement",
    })
    .optional(),
  stock: z.array(stockSchema).min(1, {
    message: "Veuillez initialiser le stock pour un point de vente",
  }),
});

function PageAdd() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const shopQuery = new ShopQuery();
  const shopsData = fetchAll(shopQuery.getAll, "shops");
  const [shops, setShops] = useState<Shop[]>([]);

  useEffect(()=>{
    if (shopsData.isSuccess) {
      setShops(shopsData.data);
    }
  },[shopsData.isSuccess, shopsData.data, setShops]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      weight: "",
      status: true,
      quantity: "",
      unit: "g",
      stock: [
        {
          quantity: "100",
          threshold: "20",
          shopId: undefined,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "stock",
  });

  const actions = new ProductVariantQuery();
  const productQuery = new ProductQuery();
  const addVariant = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      if (values.imgUrl) {
        return actions.create({
          productId: Number(values.productId),
          name: formatName(values.name),
          weight: Number(values.weight),
          status: values.status,
          price: Number(values.price),
          imgUrl: values.imgUrl,
          quantity: Number(values.quantity),
          unit: values.unit,
          stock: values.stock.map((stockItem) => ({
            quantity: Number(stockItem.quantity),
            threshold: Number(stockItem.threshold),
            shopId: Number(stockItem.shopId),
          }))
        });
      }
      return actions.create({
        productId: Number(values.productId),
        name: formatName(values.name),
        weight: Number(values.weight),
        status: values.status,
        price: Number(values.price),
        quantity: Number(values.quantity),
        unit: values.unit,
        stock: values.stock.map((stockItem) => ({
            quantity: Number(stockItem.quantity),
            threshold: Number(stockItem.threshold),
            shopId: Number(stockItem.shopId),
          }))
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["variants"],
        refetchType: "active",
      });
      router.back(); // peut planter si appelé dans un contexte modifié
    },
  });

  const products = useQuery({
    queryKey: ["products"],
    queryFn: () => productQuery.getAll(),
    refetchOnWindowFocus: false,
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addVariant.mutate(values);
  };

  return (
    <ModalLayout
      title="Ajouter une variante"
      description="Complétez le formulaire pour ajouter une variante"
      isLoading={false}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 place-items-start">
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {"Produit parent"}
                    <RequiredStar />
                  </FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full !h-10">
                        <SelectValue placeholder="Sélectionner un produit" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.isSuccess &&
                          products.data.map((x) => (
                            <SelectItem key={x.id} value={String(x.id)}>
                              {x.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-1 md:col-span-2 grid grid-cols-1 min-[580px]:grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {"Nom de la variante"}
                      <RequiredStar />
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ex. Sac, Boite" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {"Quantité"}
                      <RequiredStar />
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ex. 10" type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {"Unité"}
                      <RequiredStar />
                    </FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="kg" />
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

            </div>
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {"Poids de la variante (en kg)"}
                    <RequiredStar />
                  </FormLabel>
                  <div className="relative">
                  <FormControl>
                    <Input {...field} placeholder="Poids" className="pr-10" />
                  </FormControl>
                  <span className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                      {"kg"}
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {"Prix"}
                    <RequiredStar />
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input {...field} placeholder="Prix" className="pr-12" />
                    </FormControl>
                    <span className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 text-sm">
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
                name="imgUrl"
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
                {fields.map((field, index) => (
                  <div
                    key={index}
                    className="p-3 rounded border grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    <div className="w-full sm:col-span-2 flex justify-between gap-3 items-center mb-2">
                      <span className="px-2 py-1 bg-sky-200 rounded text-sm font-medium">{`Stock n°${index}`}</span>
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
                      name={`stock.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{"Quantité Initiale"}</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="3" type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`stock.${index}.threshold`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{"Seuil"}</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="3" type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="sm:col-span-2">
                      <FormField
                        control={form.control}
                        name={`stock.${index}.shopId`}
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
                                        .getValues("stock")
                                        .some((y) =>
                                           Number(y.shopId) === shop.id
                                        )}
                                    >
                                      {shop.name}
                                    </SelectItem>
                                  ))}
                                  {shops.length === 0 && (
                                    <SelectItem value="#" disabled>
                                      {"Aucun point de vente enregistré"}
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
                ))}
              </div>
              <Button
                variant={"black"}
                onClick={(e) => {
                  e.preventDefault();
                  append({
                    quantity: "100",
                    threshold: "20",
                    shopId: "1",
                  });
                }}
              >
                {"Ajouter un stock"}
                <Plus size={16} />
              </Button>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={addVariant.isPending}>
              {addVariant.isPending && (
                <Loader size={16} className="animate-spin" />
              )}
              {"Ajouter"}
            </Button>
            <Button
              variant={"outline"}
              onClick={(e) => {
                e.preventDefault();
                router.back();
              }}
            >
              {"Annuler"}
            </Button>
          </div>
        </form>
      </Form>
    </ModalLayout>
  );
}

export default PageAdd;
