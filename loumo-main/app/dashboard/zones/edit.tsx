"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { formatName } from "@/lib/utils";
import ZoneQuery from "@/queries/zone";
import { Address, Zone } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Loader } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  addresses: Address[];
  zone: Zone;
};

const formSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  description: z.string().optional(),
  price: z
    .string()
    .refine((val) => !isNaN(Number(val)), { message: "Doit être un nombre" }),
  status: z.enum(["ACTIVE", "INACTIVE", "PENDING", "DISABLED"]),
  addressIds: z.array(z.number()),
});

function EditZone({ isOpen, openChange, addresses, zone }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: zone.name,
      description: zone.description ?? "",
      price: String(zone.price),
      status: zone.status,
      addressIds: zone.addresses?.map((a) => a.id) ?? [],
    },
  });

  const queryClient = useQueryClient();
  const zoneQuery = new ZoneQuery();
  const updateZone = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      zoneQuery.update(zone.id, {
        name: formatName(values.name),
        price: Number(values.price),
        description: values.description ?? "",
        status: values.status,
        addressIds: values.addressIds,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["zones"],
        refetchType: "active",
      });
      openChange(false);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateZone.mutate(values);
  };

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        name: zone.name,
        description: zone.description ?? "",
        price: String(zone.price),
        status: zone.status,
        addressIds: zone.addresses?.map((a) => a.id) ?? [],
      });
    }
  }, [isOpen, zone, form]);

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{"Modifier une zone"}</DialogTitle>
          <DialogDescription>
            {"Mettez à jour les informations de la zone sélectionnée"}
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
                    <Textarea placeholder="Optionnel" {...field} />
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
                      <SelectTrigger>
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

            <FormField
              control={form.control}
              name="addressIds"
              render={() => (
                <FormItem>
                  <FormLabel>{"Quartiers associés"}</FormLabel>
                  <div className="grid grid-cols-2 gap-2 h-48 overflow-y-auto border p-2 rounded-md">
                    {addresses.length === 0 && <p className="text-sm italic text-gray-600">{"Aucun quartier enregistré."}</p>}
                    {addresses.filter(x=>x.zoneId === zone.id || x.zoneId === null).sort((a)=>a.zoneId === zone.id ? -1 : a.zoneId !== null ? 0 : 1).map((address) => (
                      <FormField
                        key={address.id}
                        control={form.control}
                        name="addressIds"
                        render={({ field }) => {
                          const isChecked = field.value?.includes(address.id);
                          return (
                            <FormItem
                              className="flex flex-row items-center space-x-2 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...field.value, address.id]);
                                    } else {
                                      field.onChange(
                                        field.value.filter((id) => id !== address.id)
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {address.street}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={updateZone.isPending}>
                {updateZone.isPending ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <CheckCircle size={16} />
                )}
                {"Modifier"}
              </Button>
              <Button
                variant="outline"
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

export default EditZone;
