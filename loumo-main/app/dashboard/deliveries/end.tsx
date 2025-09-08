'use client'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DeliveryQuery from '@/queries/delivery';
import { Delivery } from '@/types/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
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
        mutationFn: () => deliveryQuery.update(delivery.id, {
            status: "COMPLETED",
            deliveredTime: new Date()
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
                    {`Terminer la livraison ${delivery.ref}`}
                </DialogTitle>
                <DialogDescription>{"Vous souhaitez marquer la livraison suivante comme complétée"}</DialogDescription>
            </DialogHeader>
            <div className='flex justify-end gap-2'>
                <Button onClick={()=>{endDelivery.mutate()}}>
                    {"Terminer"}
                    {endDelivery.isPending && <Loader size={16} className="animate-spin" />}
                </Button>
                <Button variant={"outline"} onClick={(e)=>{e.preventDefault(); openChange(false)}}>
                    {"Fermer"}
                </Button>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default EndDelivery