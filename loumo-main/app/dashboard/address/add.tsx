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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import AddressQuery from "@/queries/address";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
};

const formSchema = z.object({
  street: z
    .string()
    .min(3, { message: "Veuillez donner le nom de la rue" })
    .max(40, { message: "Trop long" }),
  local: z
    .string()
    .min(3, { message: "Veuillez donner le nom du quartier" })
    .max(40, { message: "Trop long" }),
  description: z.string().optional(),
  published: z.boolean({ message: "Définissez le statut" }),
});

function AddAddress({ isOpen, openChange }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      street: "",
      local: "",
      description: "",
      published: true,
    },
  });

  const addressQuery = new AddressQuery();
  const createAddress = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      addressQuery.create({
        street: values.street,
        local: values.local,
        published: values.published,
        description: values.description ?? null,
        zoneId: null,
      }),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createAddress.mutate(values);
  };

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        street: "",
        local: "",
        description: "",
        published: true,
      });
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Ajouter une addresse`}</DialogTitle>
          <DialogDescription>
            {"Complétez le formulaire pour créer une nouvelle addresse"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="local"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Nom du quartier"}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ex. Elf" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Nom de la rue"}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ex. Petit terrain" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Description"}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Description du quartier..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Statut"}</FormLabel>
                  <div className="flex flex-wrap gap-2 items-center">
                    <FormControl>
                      <Switch
                        defaultChecked={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <span className="text-sm font-semibold">
                      {field.value ? "Publié" : "Non Publié"}
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={createAddress.isPending}>
                {createAddress.isPending && <Loader size={16} className="animate-spin"/>}
                {"Créer une adresse"}</Button>
              <Button
                variant={"outline"}
                onClick={(e) => {
                  e.preventDefault();
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

export default AddAddress;
