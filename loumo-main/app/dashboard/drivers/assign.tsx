"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { XAF } from "@/lib/utils";
import DeliveryQuery from "@/queries/delivery";
import OrderQuery from "@/queries/order";
import { Agent, Order } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { deliverySchema } from "../orders/assign";

type Props = {
  driver:Agent;
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
};


function AssignToDriver({driver, isOpen, openChange}:Props) {

  const form = useForm<z.infer<typeof deliverySchema>>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      orderId: "",
      agentId: String(driver.id),
      scheduledTime: ""
    }
  });

  const queryDelivery = new DeliveryQuery();
  const orderQuery = new OrderQuery();
  const queryClient = useQueryClient();
  const createDelivery = useMutation({
    mutationFn: (values: z.infer<typeof deliverySchema>) => queryDelivery.create({
      agentId: Number(values.agentId),
      orderId: Number(values.orderId),
      scheduledTime: new Date(values.scheduledTime),
      status: "STARTED"
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["agents"], refetchType: "active"});
      queryClient.invalidateQueries({queryKey:["orders"], refetchType: "active"});
      openChange(false);
    }
  });

  const getOrders = useQuery({
    queryKey: ["orders"],
    queryFn: () => orderQuery.getAll(),
  });

  const [orders, setOrders] = React.useState<Order[]>([]);

  const onSubmit = (values:z.infer<typeof deliverySchema>) => {
    createDelivery.mutate(values);
  }

  React.useEffect(()=>{
    if(getOrders.isError){
      toast.error("Erreur lors du chargement des commandes")
      openChange(false)
    }
    if(getOrders.isSuccess){
      setOrders(getOrders.data)
    }
  },[openChange, getOrders.isError, setOrders, getOrders.isSuccess, getOrders.data])

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Assigner à ${driver.user?.name}`}</DialogTitle>
          <DialogDescription>{"Choissisez une commande à assigner à un livreur"}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="orderId" render={({field})=>(
              <FormItem>
                <FormLabel>{"Commande"}</FormLabel>
                <FormControl>
                  <Select defaultValue={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner une commande"/>
                    </SelectTrigger>
                    <SelectContent>
                      { getOrders.isLoading ? 
                      <SelectItem value="no-selection" disabled className="animate-ping">{"En cours de chargement ..."}</SelectItem>
                      :
                       orders.filter(x=>x.address?.zoneId === driver.zoneId).map(y=> 
                        <SelectItem key={y.id} value={String(y.id)}>
                          <div className="grid">
                            <p className="text-sm font-medium">{`Commande ${y.id} - de ${y.user.name}`}</p>
                            <span className="text-xs text-muted-foreground">{XAF.format(y.total)}</span>
                          </div>
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
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
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AssignToDriver;
