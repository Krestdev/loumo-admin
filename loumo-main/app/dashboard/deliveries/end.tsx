'use client'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DeliveryQuery from '@/queries/delivery';
import { Delivery } from '@/types/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  delivery: Delivery;
};

function EndDelivery({isOpen, openChange, delivery}:Props) {

    const queryClient = useQueryClient();

    const deliveryQuery = new DeliveryQuery();
    const endDelivery = useMutation({
        mutationFn: (type:"terminate"|"cancel") => deliveryQuery.update(delivery.id, {
            status: type === "cancel" ? "CANCELED" : "COMPLETED"
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
                    {"Terminer la livraison"}
                </DialogTitle>
                <DialogDescription>{"Validez pour terminer ou annuler la livraison en cours"}</DialogDescription>
            </DialogHeader>
            <div className='flex justify-end gap-2'>
                <Button onClick={()=>{endDelivery.mutate("terminate")}}>
                    {"Terminer"}
                </Button>
                <Button variant={"delete"} onClick={()=>{endDelivery.mutate("cancel")}}>
                    {"Annuler la livraison"}
                </Button>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default EndDelivery