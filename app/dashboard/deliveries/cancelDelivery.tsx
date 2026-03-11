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

function CancelDelivery({isOpen, openChange, delivery}:Props) {

    const queryClient = useQueryClient();

    const deliveryQuery = new DeliveryQuery();
    const cancelDelivery = useMutation({
        mutationFn: () => deliveryQuery.update(delivery.id, {
            status: "CANCELED"
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
                    {`Annuler la livraison ${delivery.ref}`}
                </DialogTitle>
                <DialogDescription>{"Vous souhaitez annuler une livraison"}</DialogDescription>
            </DialogHeader>
            <div className='flex justify-end gap-2'>
                <Button variant={"destructive"} onClick={()=>{cancelDelivery.mutate()}}>
                    {"Annuler la livraison"}
                    {cancelDelivery.isPending && <Loader size={16} className="animate-spin" />}
                </Button>
                <Button variant={"outline"} onClick={(e)=>{e.preventDefault(); openChange(false)}}>
                    {"Fermer"}
                </Button>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default CancelDelivery