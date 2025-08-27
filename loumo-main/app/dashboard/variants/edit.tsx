"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
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
import { units } from "@/data/unit";
import { formatName, unitName } from "@/lib/utils";
import ProductVariantQuery from "@/queries/productVariant";
import { Product, ProductVariant } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  variant: ProductVariant;
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  products: Product[];
};

const formSchema = z.object({
  name: z
    .string({ message: "Veuillez renseigner un nom" })
    //.min(2, { message: "Le nom doit comporter au moins 3 caractères" })
    .max(4, { message: "4 caractères maximum" }),
  quantity: z
    .string()
    .refine((val) => Number(val) > 0, { message: "Doit être un nombre" }),
  unit: z.string({message: "Veuillez renseigner l'unité"}),
  weight: z.string({ message: "Veuillez renseigner le poids" }),
  status: z.boolean(),
  price: z.string({ message: "Veuillez renseigner un prix" }),
  productId: z.string({ message: "Veuillez sélectionner le produit parent" }),
  imgUrl: z.string().optional(),
});

function EditVariant({ variant, isOpen, openChange, products }: Props) {
  const actions = new ProductVariantQuery();
  const queryClient = useQueryClient();


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: variant.name,
      quantity: String(variant.quantity),
      unit: variant.unit,
      weight: String(variant.weight),
      status: variant.status,
      price: String(variant.price),
      productId: String(variant.productId),
      imgUrl: variant.imgUrl,
    },
  });

  const editVariant = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      actions.update(variant.id, {
        name: formatName(values.name),
        weight: Number(values.weight),
        price: Number(values.price),
        status: values.status,
        productId: Number(values.productId),
        unit: values.unit,
        quantity: Number(values.quantity)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["variants"],
        refetchType: "active",
      });
      openChange(false);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    editVariant.mutate(values);
  };

  React.useEffect(() => {
    if (isOpen && variant) {
      form.reset({
        name: variant.name,
        weight: String(variant.weight),
        status: variant.status,
        price: String(variant.price),
        productId: String(variant.productId),
        imgUrl: variant.imgUrl,
      });
    }
  }, [variant, isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Modifier ${variant.name} ${
            products.find((y) => y.id === variant.id) &&
            products.find((y) => y.id === variant.id)?.name
          }`}</DialogTitle>
          <DialogDescription>
            {
              "Complétez le formulaire pour modifier le informations de la variante"
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 place-items-start">
               <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{"Produit Lié"}</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={"Sélectionner un produit"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((x) => (
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
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{"Nom de la variante"}</FormLabel>
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
                    <FormLabel>{"Quantité"}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ex. 10" type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{"Poids"}</FormLabel>
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
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{"Unité"}</FormLabel>
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
              <FormField
                control={form.control}
                name="price"
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
                      <span className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                        {"FCFA"}
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogClose className="mt-4">
              <Button type="submit" disabled={editVariant.isPending}>
                {editVariant.isPending && (
                  <Loader size={16} className="animate-spin" />
                )}
                {"Modifier"}
              </Button>
              <Button
                variant={"outline"}
                onClick={(e) => {
                  e.preventDefault();
                  form.reset();
                  openChange(false);
                }}
              >
                {"Annuler"}
              </Button>
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditVariant;
