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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import AddressQuery from "@/queries/address";
import ShopQuery from "@/queries/shop";
import { Address, Shop } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CirclePlus, Loader } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  shops: Shop[];
};

const addressSchema = z.object({
  local: z
    .string()
    .min(3, { message: "Veuillez donner le nom du quartier" })
    .max(40, { message: "Trop long" }),
  description: z.string(),
  published: z.boolean({ message: "Définissez le statut" }),
});
const zoneSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  description: z.string().optional(),
  price: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Doit être un nombre",
  }),
  status: z.enum(["ACTIVE", "INACTIVE", "PENDING", "DISABLED"]),
  address: addressSchema,
});
const formDefault = z.object({
  name: z
    .string({ message: "Veuillez renseigner un nom" })
    .min(3, { message: "Trop court" })
    .max(21, { message: "Trop long" }),
  addressId: z
    .string({ message: "Veuillez renseigner une adresse" })
    .refine((val) => !isNaN(Number(val)), {
      message: "Renseignez une adresse valable",
    })
});
const formSchema = z.object({
  name: z
    .string({ message: "Veuillez renseigner un nom" })
    .min(3, { message: "Trop court" })
    .max(21, { message: "Trop long" }),
  zone: zoneSchema
});

function NewStore({ isOpen, openChange, shops }: Props) {
  const defaultForm = useForm<z.infer<typeof formDefault>>({
    resolver: zodResolver(formDefault),
    defaultValues: {
      name: "",
      addressId: undefined,
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      zone: {
        name: "",
        description: "",
        price: "500",
        status: "ACTIVE",
        address: {
          local: "",
          description: "",
          published: true
        }
      }
    }
  })

  const addressQuery = new AddressQuery();
  const getAllAddresses = useQuery({
    queryKey: ["addresses"],
    queryFn: () => addressQuery.getAll(),
    refetchOnWindowFocus: false,
  });

  const queryClient = useQueryClient();
  const shopQuery = new ShopQuery();
  const createShopDefault = useMutation({
    mutationFn: async (values: z.infer<typeof formDefault>) => shopQuery.create({
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

  const createShop = useMutation({
    mutationFn:   async (values: z.infer<typeof formSchema>) => shopQuery.createWithZone({
      name: values.name,
      zone: {
        name: values.zone.name,
        description: values.zone.description ?? "No description",
        price: Number(values.zone.price),
        status: values.zone.status,
      },
      addressNew: {
        street: values.zone.address.local,
        local: values.zone.address.local,
        description: values.zone.address.description ?? "",
        published: values.zone.address.published
      }
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
  })

  const [addresses, setAddresses] = React.useState<Address[]>([]);

  React.useEffect(() => {
    if (getAllAddresses.isSuccess) {
      setAddresses(getAllAddresses.data);
    }
  }, [setAddresses, getAllAddresses.isSuccess, getAllAddresses.data]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createShop.mutate(values);
  };
  const onSubmitDefault = (values: z.infer<typeof formDefault>) => {
    createShopDefault.mutate(values);
  };

  React.useEffect(() => {
    if (isOpen) {
      form.reset();
      defaultForm.reset();
    }
  }, [isOpen, form, defaultForm]);

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{"Créer un point de vente"}</DialogTitle>
          <DialogDescription>
            {"Complétez le formulaire pour créer un point de vente"}
          </DialogDescription>
        </DialogHeader>
        <Tabs>
          <TabsList>
            <TabsTrigger value="address">{"Adresse prédéfinie"}</TabsTrigger>
            <TabsTrigger value="create">{"Créer la zone"}</TabsTrigger>
          </TabsList>
          <TabsContent value="address">
            <Form {...defaultForm}>
          <form onSubmit={defaultForm.handleSubmit(onSubmitDefault)} className="space-y-6">
            <FormField
              control={defaultForm.control}
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
              control={defaultForm.control}
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
                        {addresses
                          .filter((y) => !!y.published && !shops.some(z=>z.address?.zoneId === y.zoneId))
                          .map((x) => (
                            <SelectItem key={x.id} value={String(x.id)}>
                              <div>
                                <div>{x.street}</div>
                                <div className="font-medium">
                                  {x.zone?.name}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={createShopDefault.isPending || createShop.isPending}>
                {(createShopDefault.isPending || createShop.isPending ) ? (
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
                  defaultForm.reset();
                  openChange(false);
                }}
              >
                {"Annuler"}
              </Button>
            </div>
          </form>
        </Form>
          </TabsContent>
          <TabsContent value="create">
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
              name="zone.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Nom de la zone"}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ex. Douala 5è" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zone.description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Description"}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="ex. au croisement de..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zone.price"
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
              name="zone.status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Statut"}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
            <FormField
              control={form.control}
              name="zone.address.local"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Nom du quartier"}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ex. Beedi" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zone.address.description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Description"}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="ex. au croisement de..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zone.address.published"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SwitchLabel {...field} name="Statut" />
                  </FormControl>
                  <FormMessage />
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
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default NewStore;
