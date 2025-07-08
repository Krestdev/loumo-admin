'use client'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import OrderQuery from '@/queries/order';
import { Order } from '@/types/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  order: Order;
};

function EndOrder({isOpen, openChange, order}:Props) {

    const queryClient = useQueryClient();

    const orderQuery = new OrderQuery();
    const endOrder = useMutation({
        mutationFn: (type:"terminate"|"cancel") => orderQuery.update(order.id, {
            status: type === "terminate" ? "COMPLETED" : "REJECTED"
        }),
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey:["deliveries"], refetchType: "active"});
            queryClient.invalidateQueries({queryKey:["agents"], refetchType: "active"});
            queryClient.invalidateQueries({queryKey:["orders"], refetchType: "active"});
            openChange(false);
        }
    })

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    {`Terminer la commande N°${order.id} de ${order.user.name}`}
                </DialogTitle>
                <DialogDescription>{"Validez pour terminer ou annuler la commande en cours"}</DialogDescription>
            </DialogHeader>
            <div className='flex justify-end gap-2'>
                <Button onClick={()=>{endOrder.mutate("terminate")}}>
                    {"Terminer"}
                </Button>
                <Button variant={"delete"} onClick={()=>{endOrder.mutate("cancel")}}>
                    {"Annuler la commande"}
                </Button>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default EndOrder