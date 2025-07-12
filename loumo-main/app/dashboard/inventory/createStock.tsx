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
import ProductVariantQuery from "@/queries/productVariant";
import ShopQuery from "@/queries/shop";
import StockQuery from "@/queries/stock";
import { ProductVariant, Shop } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
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

function CreateStockPage({isOpen, openChange}:Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: "",
      threshold: "",
      shopId: "",
      productVariantId: "",
    },
  });

  const [shops, setShops] = useState<Shop[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const queryClient = useQueryClient();
  const stockQuery = new StockQuery();
  const variantQuery = new ProductVariantQuery();
  const shopQuery = new ShopQuery();

  const getShops = useQuery({
    queryKey: ["shops"],
    queryFn: () => shopQuery.getAll(),
    refetchOnWindowFocus: false,
  });

  const getVariants = useQuery({
    queryKey: ["variants"],
    queryFn: () => variantQuery.getAll(),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (getShops.isSuccess) setShops(getShops.data);
    if (getVariants.isSuccess) setVariants(getVariants.data);
  }, [
    getShops.isSuccess,
    getShops.data,
    getVariants.isSuccess,
    getVariants.data,
    setShops,
    setVariants,
  ]);

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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une variante" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {getVariants.isLoading && <div className="flex gap-2 items-center text-sm text-gray-600"><Loader size={16}/>{"Chargement..."}</div>}
                      {variants.map((variant) => (
                        <SelectItem key={variant.id} value={String(variant.id)}>
                          {variant.name}{variant.product && ` - ${variant.product.name}`}
                        </SelectItem>
                      ))}
                      {variants.length === 0 && <SelectItem value="#" disabled>{"Aucune variante de produit enregistrée"}</SelectItem>}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un Point de vente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {getShops.isLoading && <div className="flex gap-2 items-center text-sm text-gray-600"><Loader size={16}/>{"Chargement..."}</div>}
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
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateStockPage;
