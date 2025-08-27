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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { formatName } from "@/lib/utils";
import AddressQuery from "@/queries/address";
import { Address, Zone } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  address: Address;
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  zones: Zone[];
};

const formSchema = z.object({
  zoneId: z
    .string()
    .refine((val) => !!val && !isNaN(Number(val)) && Number(val) > 0, {
      message: "Renseignez une zone valide",
    }),
  local: z
    .string()
    .min(3, { message: "Veuillez donner le nom du quartier" })
    .max(40, { message: "Trop long" }),
  description: z.string().optional(),
  published: z.boolean({ message: "Définissez le statut" }),
});

function EditAddress({ address, isOpen, openChange, zones }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      zoneId: String(address.zoneId),
      local: address.local,
      description: address.description ?? "",
      published: address.published,
    },
  });

  const queryClient = useQueryClient();

  const addressQuery = new AddressQuery();
  const updateAddress = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      addressQuery.update(address.id, {
        street: formatName(values.local),
        local: formatName(values.local),
        published: values.published,
        description: values.description ?? null,
        zoneId: Number(values.zoneId),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: ["zones"],
        refetchType: "active",
      });
      openChange(false);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateAddress.mutate(values);
  };

  React.useEffect(() => {
    if (isOpen && address) {
      form.reset({
        zoneId: String(address.zoneId),
        local: address.local,
        description: address.description ?? "",
        published: address.published,
      });
    }
  }, [address, isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Modifier ${address.local} - ${address.street}`}</DialogTitle>
          <DialogDescription>
            {"Mettre à jour les informations liées au quartier"}
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
              name="zoneId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Zone"}</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={"Sélectionner une zone"} />
                      </SelectTrigger>
                      <SelectContent>
                        {zones.map((x) => (
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
              <Button type="submit" disabled={updateAddress.isPending}>
                {updateAddress.isPending && (
                  <Loader size={16} className="animate-spin" />
                )}
                {"Enregistrer les modifications"}
              </Button>
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

export default EditAddress;
