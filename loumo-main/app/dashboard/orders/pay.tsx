'use client'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PaymentQuery from '@/queries/payment';
import { Order } from '@/types/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  order: Order;
};

function PayOrder({isOpen, openChange, order}:Props) {

    const queryClient = useQueryClient();

    const paymentQuery = new PaymentQuery();
    const payOrder = useMutation({
        mutationFn: ()=>{
            return paymentQuery.cash({
                name: String(new Date()),
                total: order.total,
                tel: order.user.tel ?? "--",
                orderId: order.id
            });
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey:["payments"], refetchType: "active"});
            queryClient.invalidateQueries({queryKey:["orders"], refetchType: "active"});
            openChange(false);
        }
    })

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    {`Encaisser le paiement`}
                </DialogTitle>
                <DialogDescription>{`Enregistrer le paiement de la commande N°${order.ref} de ${order.user.name}`}</DialogDescription>
            </DialogHeader>
            <div className='flex justify-end gap-2'>
                <Button onClick={()=>{payOrder.mutate()}}>
                    {"Encaisser"}
                </Button>
                <Button variant={"outline"} onClick={()=>{openChange(false)}}>
                    {"Annuler"}
                </Button>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default PayOrder