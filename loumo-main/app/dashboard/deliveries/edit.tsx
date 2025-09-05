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
import DeliveryQuery from "@/queries/delivery";
import { Agent, Delivery } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  delivery: Delivery;
  agents: Agent[];
};

const priorityValues = ["LOW", "NORMAL", "HIGH", "URGENT"] as const;

const deliverySchema = z.object({
  agentId: z
    .string({ message: "Veuillez sélectionner un livreur" })
    .refine((val) => !isNaN(Number(val)), {
      message: "ID du livreur invalide",
    }),
  scheduledTime: z
    .string({ message: "Veuillez fournir une date" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Date invalide",
    }),
  priority: z.enum(priorityValues),
});

function EditDelivery({ isOpen, openChange, delivery, agents }: Props) {
  const form = useForm<z.infer<typeof deliverySchema>>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      agentId: String(delivery.agentId),
      scheduledTime: new Date(delivery.scheduledTime).toISOString().slice(0, 16),
    },
  });

  const queryDelivery = new DeliveryQuery();
  const queryClient = useQueryClient();

  const updateDelivery = useMutation({
    mutationFn: (values: z.infer<typeof deliverySchema>) =>
      queryDelivery.update(delivery.id, {
        agentId: Number(values.agentId),
        scheduledTime: new Date(values.scheduledTime),
        priority: values.priority,
      }),
      onSuccess: ()=>{
        queryClient.invalidateQueries({queryKey: ["deliveries"], refetchType: "active"});
        queryClient.invalidateQueries({queryKey: ["agents"], refetchType: "active"});
        queryClient.invalidateQueries({queryKey: ["agents"], refetchType: "active"});
      }
  });

  const onSubmit = (values: z.infer<typeof deliverySchema>) => {
    updateDelivery.mutate(values);
  };

  React.useEffect(()=>{
    if(isOpen){
        form.reset({
        agentId: String(delivery.agentId ?? ""),
        scheduledTime: new Date(delivery.scheduledTime).toISOString().slice(0, 16),
        priority: delivery.priority,
      });
    }
  }, [isOpen, form, delivery])

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{"Modifier la livraison"}</DialogTitle>
          <DialogDescription>
            {"Transformez les informtions liées à la livraison"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Priorité"}</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Définir la priorité" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityValues.map((x) => (
                          <SelectItem key={x} value={x}>
                            {getPriorityName(x)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
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
                        {agents.filter(
                          (d) =>
                            d.zone.some(f => f.id === delivery.order?.address?.zoneId) &&
                            d.status === "AVAILABLE"
                        ).length > 0 ? (
                          agents
                            .filter(
                              (d) =>
                                d.zone.some(f => f.id === delivery.order?.address?.zoneId)  &&
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
            <div className="flex justify-end gap-2">
                <Button type="submit" disabled={updateDelivery.isPending}>
                    {updateDelivery.isPending && <Loader size={16} className="animate-spin"/>}
                    {"Modifier"}
                </Button>
                <Button onClick={(e)=>{e.preventDefault(); form.reset(); openChange(false);} } variant={"outline"}>
                    {"Annuler"}
                </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditDelivery;
