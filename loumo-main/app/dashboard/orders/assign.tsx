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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AgentQuery from "@/queries/agent";
import DeliveryQuery from "@/queries/delivery";
import { Agent, Order, Zone } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  order: Order;
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  zones: Zone[];
};

export const deliverySchema = z.object({
  agentId: z
    .string({ message: "Veuillez sélectionner un livreur" })
    .refine((val) => !isNaN(Number(val)), {
      message: "ID du livreur invalide",
    }),

  orderId: z
    .string({ message: "Veuillez sélectionner une commande" })
    .refine((val) => !isNaN(Number(val)), {
      message: "ID de la commande invalide",
    }),

  scheduledTime: z
    .string({ message: "Veuillez fournir une date" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Date invalide",
    }),
});

function AssignDriver({ order, isOpen, openChange, zones }: Props) {
  const form = useForm<z.infer<typeof deliverySchema>>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      orderId: String(order.id),
      agentId: "",
      scheduledTime: "",
    },
  });

  const agentQuery = new AgentQuery();
  const queryClient = useQueryClient();
  const getAgents = useQuery({
    queryKey: ["agents"],
    queryFn: () => agentQuery.getAll(),
    refetchOnWindowFocus: false,
  });

  const deliveryQuery = new DeliveryQuery();
  const createDelivery = useMutation({
    mutationFn: (values: z.infer<typeof deliverySchema>) =>
      deliveryQuery.create({
        agentId: Number(values.agentId),
        orderId: Number(values.orderId),
        scheduledTime: new Date(values.scheduledTime),
        status: "STARTED"
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["agents"], refetchType: "active"});
      queryClient.invalidateQueries({queryKey:["orders"], refetchType: "active"});
      openChange(false);
      form.reset();
    },
  });

  const onSubmit = (values: z.infer<typeof deliverySchema>) => {
    createDelivery.mutate(values);
  };

  const [drivers, setDrivers] = React.useState<Agent[]>([]);
  //const [selected, setSelected] = React.useState<number>();

  React.useEffect(() => {
    if (getAgents.isSuccess) {
      setDrivers(getAgents.data);
    }
    if(isOpen){
      form.reset();
    }
  }, [setDrivers, getAgents.data, getAgents.isSuccess, isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{"Assigner un livreur"}</DialogTitle>
          <DialogDescription>
            {`Sélectionnez un livreur pour la commande ${order.id}`}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-medium">{"Détails de la commande"}</p>
            <p className="text-sm text-muted-foreground">
              {`Client: ${order.user?.name ?? "Non défini"}`}
            </p>
            <p className="text-sm text-muted-foreground">
              {`Zone: ${
                zones.find((x) => x.id === order.address?.id)?.name ??
                "Non défini"
              }`}
            </p>
            <p className="text-sm text-muted-foreground">
              {`Poids: ${order.weight}kg`}
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="agentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{"Livreur"}</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner un livreur" />
                        </SelectTrigger>
                        <SelectContent>
                          {drivers.filter(
                            (d) =>
                              d.zoneId === order.address?.zoneId &&
                              d.status === "AVAILABLE"
                          ).length > 0 ? (
                            drivers
                              .filter(
                                (d) =>
                                  d.zoneId === order.address?.zoneId &&
                                  d.status === "AVAILABLE"
                              )
                              .map((x) => (
                                <SelectItem key={x.id} value={String(x.id)}>
                                  {x.user?.name ?? x.id}
                                </SelectItem>
                              ))
                          ) : (
                            <SelectItem value="no-value" disabled>
                              {"Aucun livreur disponible dans cette zone"}
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      {
                        "La liste des livreurs ne compte que ceux disponibles dans la zone de livraison de la commande"
                      }
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="scheduledTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{"Date de livraison prévue"}</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        value={field.value}
                        onChange={field.onChange}
                        min={new Date().toISOString().slice(0, 16)} // empêche de choisir une date passée
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="submit" disabled={createDelivery.isPending}>{createDelivery.isPending && <Loader size={16} className="animate-spin"/>} {"Assigner"}</Button>
          <Button variant="outline" onClick={() => openChange(false)}>
            {"Annuler"}
          </Button>
        </div>
            </form>
          </Form>

          {/* <div className="space-y-2">
            <Label>{"Livreurs disponibles"}</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {getAgents.isLoading ? (
                <div className="h-12 w-full flex items-center justify-center">
                  <Loader2 className="animate-spin text-green-600" size={20} />
                </div>
              ) : drivers.filter(
                  (driver) =>
                    driver.zone.id === order.address?.zoneId &&
                    driver.status === "AVAILABLE"
                ).length > 0 ? (
                drivers
                  .filter(
                    (driver) =>
                      driver.zone.id === order.address?.zoneId &&
                      driver.status === "AVAILABLE"
                  )
                  .map((driver) => (
                    <Button
                      key={driver.id}
                      variant={"ghost"}
                      className="w-full flex items-center justify-between h-14 border rounded-lg hover:bg-muted cursor-pointer"
                      onClick={() => {
                        setSelected(driver.id)
                        createDelivery.mutate(driver.id);
                      }}
                      disabled={createDelivery.isPending}
                    >
                      <div className="flex flex-col text-start">
                        <p className="font-medium">
                          {driver.user?.name ?? "Non défini"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {driver.zone.name}
                        </p>
                      </div>
                      <Button variant={"secondary"} size={"sm"} disabled={(createDelivery.isPending && driver.id === selected )}>{(createDelivery.isPending && driver.id === selected ) && <Loader size={16} className="animate-spin"/>} {"Assigner"}</Button>
                    </Button>
                  ))
              ) : (
                <div className="w-full flex items-center text-muted-foreground italic">
                  {"Aucun livreur correspondant"}
                </div>
              )}
            </div>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AssignDriver;
