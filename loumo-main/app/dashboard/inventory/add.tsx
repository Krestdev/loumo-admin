"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import StockQuery from "@/queries/stock";
import { Product, Shop, Stock } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  stock: Stock;
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  products: Product[];
  shops: Shop[];
};

const formSchema = z.object({
  quantity: z
    .string({ message: "Veuillez entrer une quantité" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "La quantité doit être un nombre supérieur à 0",
    }),
});

function Restock({ stock, isOpen, openChange, products, shops }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: "0",
    },
  });

  const stockQuery = new StockQuery();
  const queryClient = useQueryClient();
  const addToStock = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      stockQuery.restock(stock.id, {
        quantity: Number(values.quantity),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stocks"],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: ["variants"],
        refetchType: "active",
      });
      form.reset();
      openChange(false);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addToStock.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {`Approvisionner ${
              products.find((x) => x.id === stock.productVariant?.productId)
                ?.name ?? "Produit Introuvable"
            } - ${stock.productVariant?.name ?? "Vairante introuvable"}`}
          </DialogTitle>
          <DialogDescription>
            {"Modifiez le stock d'un produit"}
          </DialogDescription>
        </DialogHeader>
        <div>
          <h3 className="text-lg font-semibold">{"Stock Actuel"}</h3>
          <div className="flex gap-3 items-center text-sm">
            <span>{`${
              shops.find((y) => y.id === stock.shopId)?.name ??
              "Boutique introuvable"
            } :`}</span>
            <span className="font-semibold">{stock.quantity}</span>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-5">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Quantité à ajouter"}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={1}
                      placeholder="Ex : 10"
                    />
                  </FormControl>
                  <FormDescription>
                    {`Boutique concernée : ${
                      shops.find((y) => y.id === stock.shopId)?.name ??
                      "Boutique introuvable"
                    }`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={addToStock.isPending}>
                {addToStock.isPending && (
                  <Loader size={16} className="animate-spin" />
                )}
                {"Réapprovisionner"}
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
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default Restock;
