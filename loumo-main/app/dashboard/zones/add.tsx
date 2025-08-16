"use client";
import SwitchLabel from "@/components/switchLabel";
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
import { Textarea } from "@/components/ui/textarea";
import ZoneQuery from "@/queries/zone";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CirclePlus, Loader, PlusCircle, X } from "lucide-react";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
};

const addressSchema = z.object({
  street: z
    .string()
    .min(3, { message: "Veuillez donner le nom de la rue" })
    .max(40, { message: "Trop long" }),
  local: z
    .string()
    .min(3, { message: "Veuillez donner le nom du quartier" })
    .max(40, { message: "Trop long" }),
  description: z.string(),
  published: z.boolean({ message: "Définissez le statut" }),
});

const formSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  description: z.string().optional(),
  price: z.string()
  .refine((val) => !isNaN(Number(val)), {
      message: "Doit être un nombre",
    }),
  status: z.enum(["ACTIVE", "INACTIVE", "PENDING", "DISABLED"]),
  addresses: z.array(addressSchema),
});

function AddZone({ isOpen, openChange }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "1500",
      status: "ACTIVE",
      addresses: []
    },
  });
  const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: "addresses",
    });


  const queryClient = useQueryClient();
  const zoneQuery = new ZoneQuery();
  const createZone= useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      zoneQuery.create({
          name: values.name,
          price: Number(values.price),
          description: values.description ?? "",
          status: values.status,
          addresses: values.addresses.map(el=> el.description !== "" ? el : {local:el.local, street: el.street, published: el.published})
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["zones"],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
        refetchType: "active"
      });
      openChange(false);
    },
  });


  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createZone.mutate(values);
  };

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        name: "",
        description: "",
        price: "1500",
        status: "ACTIVE",
        addresses: []
      });
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{"Créer une zone"}</DialogTitle>
          <DialogDescription>
            {"Complétez le formulaire pour créer une zone"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{"Nom de la zone"}</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Zone Nord" {...field} />
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
                <Textarea placeholder="ex. au croisement de..." {...field} />
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
              <FormLabel>{"Frais de livraison (FCFA)"}</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{"Statut"}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choisir un statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ACTIVE">{"Active"}</SelectItem>
                  <SelectItem value="INACTIVE">{"Inactive"}</SelectItem>
                  <SelectItem value="PENDING">{"En attente"}</SelectItem>
                  <SelectItem value="DISABLED">{"Désactivée"}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-4">
          <h3 className="font-semibold">{`Quartiers (${fields.length})`}</h3>
          {fields.length === 0 && 
          <span className="text-sm text-gray-600 italic">{"Aucun quartier ajouté"}</span>}
          {
            fields.map((field, index)=>(
              <div key={field.id} className="p-3 rounded-md border grid grid-cols-1 gap-3">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-semibold text-lg">{"Adresse"}</span>
                  <Button variant={"delete"} size={"icon"} onClick={(e)=>{e.preventDefault(); remove(index)}}>
                    <X size={16} />
                  </Button>
                </div>
                <FormField control={form.control} name={`addresses.${index}.local`} render={({field})=>(
                  <FormItem>
                    <FormLabel>
                      {"Nom du quartier"}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ex. Beedi" />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}/>
                <FormField control={form.control} name={`addresses.${index}.street`} render={({field})=>(
                  <FormItem>
                    <FormLabel>
                      {"Nom de la rue"}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ex. petit terrain" />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}/>
                <FormField control={form.control} name={`addresses.${index}.description`} render={({field})=>(
                  <FormItem>
                    <FormLabel>
                      {"Description"}
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Description..." />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}/>
                <FormField control={form.control} name={`addresses.${index}.published`} render={({field: {name, ...props}})=>(
                  <FormItem>
                    <FormControl>
                      <SwitchLabel name="Statut" {...props}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}/>
              </div>
            ))
          }
          <Button variant={"outline"} className="w-full border-dashed shadow-none" onClick={(e)=>{e.preventDefault();append({
            street: "",
            local: "",
            description: "",
            published: true
          })}}>
            <PlusCircle size={16}/>
            {"Ajouter un quartier"}
          </Button>
        </div>
            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={createZone.isPending}>
                {createZone.isPending ? (
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

export default AddZone;
