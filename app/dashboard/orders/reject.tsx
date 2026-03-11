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

function RejectOrder({isOpen, openChange, order}:Props) {

    const queryClient = useQueryClient();

    const orderQuery = new OrderQuery();
    const rejectOrder = useMutation({
        mutationFn: ()=>{
            return orderQuery.reject(order.id);
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey:["orders"], refetchType: "active"});
            openChange(false);
        }
    })

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    {`Rejeter la commande ${order.ref}`}
                </DialogTitle>
                <DialogDescription>{`Vous souhaitez rejeter la commande suivante`}</DialogDescription>
            </DialogHeader>
            <div className='flex justify-end gap-2'>
                <Button variant={"destructive"} onClick={()=>{rejectOrder.mutate()}}>
                    {"Rejeter"}
                </Button>
                <Button variant={"outline"} onClick={()=>{openChange(false)}}>
                    {"Annuler"}
                </Button>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default RejectOrder