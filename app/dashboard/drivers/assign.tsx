"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { XAF } from "@/lib/utils";
import DeliveryQuery from "@/queries/delivery";
import OrderQuery from "@/queries/order";
import { Agent, Order, Zone } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

type Props = {
  driver:Agent;
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
};

const formSchema = z.object({
  orderId: z.string().min(1, {message: "Veuillez sélectionner une commande"})
})

function AssignToDriver({driver, isOpen, openChange}:Props) {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderId: ""
    }
  });

  const queryDelivery = new DeliveryQuery();
  const orderQuery = new OrderQuery();
  const queryClient = useQueryClient();
  const createDelivery = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => queryDelivery.create({
      agentId: driver.id,
      orderId: Number(values.orderId)
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

  const onSubmit = (values:z.infer<typeof formSchema>) => {
    createDelivery.mutate(values);
  }

  React.useEffect(()=>{
    if(getOrders.isError){
      toast.error("Erreur lors du chargement des commandes")
      openChange(false)
    }
  },[openChange, toast, getOrders.isError])

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Assigner à ${driver.user?.name}`}</DialogTitle>
          <DialogDescription>{"Choissisez une commande à assigner à un livreur"}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {
              getOrders.isLoading ? 
              <div className="py-5 w-full">
                <Loader size={20} className="animate-spin text-green-600"/>
              </div>
              :
              getOrders.isSuccess &&
              <FormField control={form.control} name="orderId" render={({field})=>(
              <FormItem>
                <FormLabel>{"Commande"}</FormLabel>
                <FormControl>
                  <Select defaultValue={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner une commande"/>
                    </SelectTrigger>
                    <SelectContent>
                      {getOrders.data.filter(x=>x.address?.zoneId === driver.zoneId).map(y=> 
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
            )}/>}
            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={createDelivery.isPending || getOrders.isLoading}>{createDelivery.isPending && <Loader size={16} className="animate-spin"/>} {"Assigner"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AssignToDriver;
