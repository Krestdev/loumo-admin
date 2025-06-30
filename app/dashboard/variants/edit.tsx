"use client";
import {
  Dialog,
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductVariantQuery from "@/queries/productVariant";
import { Product, ProductVariant } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  name: z.string({ message: "Veuillez renseigner un nom" }),
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
      weight: String(variant.weight),
      status: variant.status,
      price: String(variant.price),
      productId: String(variant.productId),
      imgUrl: variant.imgUrl,
    },
  });

  const editVariant = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => actions.update(variant.id,{
        name: values.name,
        weight: Number(values.weight),
        price: Number(values.price),
        status: values.status,
        productId: Number(values.productId),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["variants"],
        refetchType: "active",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    editVariant.mutate(values);
  };

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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Nom de la variante"}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nom" />
                  </FormControl>
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
                      <Input {...field} placeholder="Prix" className="pr-12" />
                    </FormControl>
                    <span className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                      {"FCFA"}
                    </span>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Poids"}</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input {...field} placeholder="Poids" className="pr-10" />
                    </FormControl>
                    <span className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                      {"kg"}
                    </span>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Produit Parent"}</FormLabel>
                  <FormControl>
                    <Select defaultValue={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                            <SelectValue placeholder={"Sélectionner un produit"}/>
                        </SelectTrigger>
                        <SelectContent>
                            {products.map(x=>
                                <SelectItem key={x.id} value={String(x.id)}>{x.name}</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditVariant;
