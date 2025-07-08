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
import AddressQuery from "@/queries/address";
import ShopQuery from "@/queries/shop";
import { Address } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CirclePlus, Loader } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
};

const formSchema = z.object({
  name: z
    .string({ message: "Veuillez renseigner un nom" })
    .min(3, { message: "Trop court" })
    .max(21, { message: "Trop long" }),
  addressId: z
    .string({ message: "Veuillez renseigner une adresse" })
    .refine((val) => !isNaN(Number(val)), {
      message: "Renseignez une adresse valable",
    }),
});

function NewStore({ isOpen, openChange }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      addressId: "",
    },
  });

  const addressQuery = new AddressQuery();
  const getAllAddresses = useQuery({
    queryKey: ["addresses"],
    queryFn: () => addressQuery.getAll(),
    refetchOnWindowFocus: false,
  });

  const queryClient = useQueryClient();
  const shopQuery = new ShopQuery();
  const createShop = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      shopQuery.create({
        name: values.name,
        addressId: Number(values.addressId),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shops"],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: ["zones"],
        refetchType: "active",
      });
      openChange(false);
    },
  });

  const [addresses, setAddresses] = React.useState<Address[]>([]);

  React.useEffect(() => {
    if (getAllAddresses.isSuccess) {
      setAddresses(getAllAddresses.data);
    }
  }, [setAddresses, getAllAddresses.isSuccess, getAllAddresses.data]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createShop.mutate(values);
  };

  React.useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{"Créer un point de vente"}</DialogTitle>
          <DialogDescription>
            {"Complétez le formulaire pour créer un point de vente"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Nom du point de vente"}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Entrez un nom" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addressId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Adresse"}</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionnez une adresse" />
                      </SelectTrigger>
                      <SelectContent>
                        {addresses.filter(y=>!!y.published).map((x) => (
                          <SelectItem key={x.id} value={String(x.id)}>
                            <div>
                            <div>{x.street}</div>
                            <div className="font-medium">{x.zone?.name}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={createShop.isPending}>
                {createShop.isPending ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <CirclePlus size={16} />
                )}{" "}
                {"Ajouter"}
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

export default NewStore;
