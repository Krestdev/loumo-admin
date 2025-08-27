import { Button } from "@/components/ui/button";
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
import { formatName } from "@/lib/utils";
import ShopQuery from "@/queries/shop";
import { Shop, Zone } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Props {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  store: Shop;
  zones: Zone[];
}

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

function EditStore({ isOpen, openChange, store, zones }: Props) {
  const actions = new ShopQuery();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: store.name,
      addressId: String(store.addressId) ?? undefined,
    },
  });

  const editShop = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      actions.update(store.id, {
        name: formatName(values.name),
        addressId: Number(values.addressId),
      }),
      onSuccess:()=>{
        queryClient.invalidateQueries({queryKey: ["shops"], refetchType: "active"});
        queryClient.invalidateQueries({queryKey: ["zones"], refetchType: "active"});
        openChange(false);
      }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    editShop.mutate(values);
  };

  useEffect(() => {
    if (isOpen && !!store) {
      form.reset({
        name: store.name,
        addressId: String(store.addressId),
      });
    }
  }, [isOpen, store, form]);

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Modifier ${store.name}`}</DialogTitle>
          <DialogDescription>
            {"Modifier les informations du point de vente"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Nom du Point de vente"}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ex. Loumo-Mboppi" />
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
                  <FormLabel>{"Zone"}</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionnez une adresse" />
                      </SelectTrigger>
                      <SelectContent>
                        {zones
                          .filter((zone) =>
                            zone.addresses.some((add) => !!add.published)
                          )
                          .map((zone) => (
                            <SelectItem
                              key={zone.id}
                              value={String(
                                zone.addresses.find((x) => !!x.published)?.id
                              )}
                            >
                              {zone.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={editShop.isPending}>
                {editShop.isPending && (
                  <Loader size={16} className="animate-spin" />
                )}
                {editShop.isPending
                  ? "Modification..."
                  : "Sauvegarder les modifications"}
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

export default EditStore;
