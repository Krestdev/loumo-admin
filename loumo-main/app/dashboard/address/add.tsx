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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/providers/datastore";
import AddressQuery from "@/queries/address";
import { Zone } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  zones: Zone[];
};

const formSchema = z.object({
  local: z
    .string()
    .min(3, { message: "Veuillez donner le nom du quartier" })
    .max(40, { message: "Trop long" }),
  description: z.string(),
  published: z.boolean({ message: "Définissez le statut" }),
  zoneId: z.string().refine((val) => !!val && !isNaN(Number(val)) && Number(val) > 0, {
  message: "Renseignez une zone valide",
})
});

function AddAddress({ isOpen, openChange, zones }: Props) {

  //Store
  const { addToast } = useStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      local: "",
      description: "",
      published: true,
      zoneId: ""
    },
  });

  const queryClient = useQueryClient();
  const addressQuery = new AddressQuery();
  const createAddress = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      addressQuery.create({
        street: values.local,
        local: values.local,
        published: values.published,
        description: values.description ?? "",
        zoneId: Number(values.zoneId),
      }),
      onSuccess: ()=>{
        queryClient.invalidateQueries({queryKey: ["addresses"], refetchType: "active"});
        queryClient.invalidateQueries({queryKey: ["zones"], refetchType: "active"});
        openChange(false);
        addToast({title: "Quartier ajouté avec succès !", variant:"success"});
      }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createAddress.mutate(values);
  };

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        local: "",
        description: "",
        published: true,
        zoneId: ""
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
              name="zoneId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Zone associée"}</FormLabel>
                  <FormControl>
                    <Select defaultValue={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner une zone"/>
                      </SelectTrigger>
                      <SelectContent>
                        {zones.length === 0 ?
                        <p className="italic text-sm text-gray-600">{"Aucune zone enregistrée. Créez une zone pour ajouter une adresse"}</p>
                      :
                      zones.map(x=>
                        <SelectItem key={x.id} value={String(x.id)}>{x.name}</SelectItem>
                      )}
                      </SelectContent>
                    </Select>
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
