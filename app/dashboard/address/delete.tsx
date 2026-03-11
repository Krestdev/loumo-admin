'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AddressQuery from '@/queries/address';
import { Address } from '@/types/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader, Trash2 } from 'lucide-react';
import React from 'react';

type Props = {
  address: Address;
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
};

function DeleteAddress({ address, isOpen, openChange }: Props) {
    const queryClient = useQueryClient();
    const actions = new AddressQuery();
    const deleteAddress = useMutation({
        mutationFn: (id:number)=> actions.delete(id),
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ["zones"], refetchType: "active"});
            queryClient.invalidateQueries({queryKey: ["addresses"], refetchType: "active"});
            openChange(false);
        }
    })
  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
                <DialogTitle>{`Supprimer ${address.street}`}</DialogTitle>
                <DialogDescription>{"Êtes-vous sûr de vouloir supprimer ce quartier ?"}</DialogDescription>
            </DialogHeader>
            <div className='flex justify-end gap-2'>
                <Button variant={"destructive"} onClick={()=>{deleteAddress.mutate(address.id)}} disabled={deleteAddress.isPending}>{ deleteAddress.isPending ? <Loader size={16}/> : <Trash2 size={16}/>} {"Supprimer"}</Button>
                <Button variant={"outline"} onClick={()=>openChange(false)}>{"Annuler"}</Button>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default DeleteAddress