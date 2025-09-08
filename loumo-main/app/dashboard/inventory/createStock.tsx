"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import StockQuery from "@/queries/stock";
import { Product, ProductVariant, Shop } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  shops: Shop[];
  variants: ProductVariant[];
  products: Product[];
};

const formSchema = z.object({
  quantity: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Quantité invalide",
  }),
  threshold: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Seuil invalide",
  }),
  shopId: z.string().min(1, "Choisir un magasin"),
  productVariantId: z.string().min(1, "Choisir une variante de produit"),
});

function CreateStockPage({isOpen, openChange, shops, variants, products}:Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: "",
      threshold: "",
      shopId: "",
      productVariantId: "",
    },
  });

  const queryClient = useQueryClient();
  const stockQuery = new StockQuery();

  const createStock = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      stockQuery.create({
        quantity: Number(values.quantity),
        threshold: Number(values.threshold),
        productVariantId: Number(values.productVariantId),
        shopId: Number(values.shopId),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"], refetchType: "active" });
      queryClient.invalidateQueries({ queryKey: ["variants"], refetchType: "active" });
      form.reset();
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createStock.mutate(values);
  };

  const [selectedProduct, setSelectedProduct] = useState<string>();

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent>
        <DialogHeader>
        <DialogTitle>{"Créer un stock"}</DialogTitle>
        <DialogDescription>
          {"Remplissez les champs pour ajouter un stock."}
        </DialogDescription>
      </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-5">
            <FormField
              control={form.control}
              name="shopId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Boutique"}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choisir un Point de vente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {shops.map((shop) => (
                        <SelectItem key={shop.id} value={String(shop.id)}>
                          {shop.name}
                        </SelectItem>
                      ))}
                      {shops.length === 0 && <SelectItem value="#" disabled>{"Aucun point de vente enregistré"}</SelectItem>}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-1">
              <FormLabel>
                {"Produit"}
              </FormLabel>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez un produit"/>
                </SelectTrigger>
                <SelectContent>
                  {products
                  .filter(product => (product.variants ?? []).filter(v => !v.stock.some(s => s.shopId === Number(form.getValues("shopId")))).length > 0)
                  .map((q, id)=>(
                    <SelectItem key={id} value={String(q.id)}>{q.name}</SelectItem>
                  ))}
                  {products
                  .filter(product => (product.variants ?? []).filter(v => !v.stock.some(s => s.shopId === Number(form.getValues("shopId")))).length > 0) &&
                  <SelectItem value="##" disabled>{"Aucun produit nécessitant la création d'un stock"}</SelectItem>}
                </SelectContent>
              </Select>
            </div>
            <FormField
              control={form.control}
              name="productVariantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Variante de produit"}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choisir une variante" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {variants.filter(x=>!x.stock.some(y=>y.shopId === Number(form.getValues("shopId")))).filter(x=> selectedProduct ? x.productId === Number(selectedProduct) : true).map((variant) => (
                        <SelectItem key={variant.id} value={String(variant.id)} disabled={variant.stock.some(y=>y.shopId === Number(form.getValues("shopId")))}>
                          {`${variant.name} ${variant.quantity} ${variant.unit}`}{variant.product && ` - ${variant.product.name}`}
                        </SelectItem>
                      ))}
                      {variants.filter(x=>!x.stock.some(y=>y.shopId === Number(form.getValues("shopId")))).filter(x=> selectedProduct ? x.productId === Number(selectedProduct) : true).length === 0 
                      && <SelectItem value="#" disabled>{"Aucune variante correspondante"}</SelectItem>}
                    </SelectContent>
                  </Select>
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
                    <Input {...field} placeholder="Ex: 20" type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="threshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Seuil d’alerte"}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: 5" type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <Button type="submit" disabled={createStock.isPending}>
                {createStock.isPending && (
                  <Loader className="animate-spin" size={16} />
                )}
                {"Ajouter le stock"}
              </Button>
              <Button onClick={(e)=>{e.preventDefault(); openChange(false)}} variant={"outline"}>{"Annuler"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateStockPage;
