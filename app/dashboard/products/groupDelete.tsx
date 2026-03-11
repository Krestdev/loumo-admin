'use client'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProductQuery from '@/queries/product';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader, Trash2 } from 'lucide-react';
import React from 'react'

type Props = {
    ids: number[];
    isOpen: boolean;
    openChange: React.Dispatch<React.SetStateAction<boolean>>;
}

function GroupDelete({ids, isOpen, openChange}:Props) {
    const queryClient = useQueryClient();
    const actions = new ProductQuery();
    const deleteProducts = useMutation({
        mutationFn: (ids:number[])=> actions.bulckDelete(ids),
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ["products"], refetchType: "active"});
            queryClient.invalidateQueries({queryKey: ["categories"], refetchType: "active"});
            openChange(false);
        }
    })
  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
                <DialogTitle>{`Supprimer ${ids.length} produits`}</DialogTitle>
                <DialogDescription>{"Êtes-vous sûr de vouloir supprimer ces produits ?"}</DialogDescription>
            </DialogHeader>
            <div className='flex justify-end gap-2'>
                <Button variant={"destructive"} onClick={()=>{deleteProducts.mutate(ids)}} disabled={deleteProducts.isPending}>{ deleteProducts.isPending ? <Loader size={16}/> : <Trash2 size={16}/>} {"Supprimer"}</Button>
                <Button variant={"outline"} onClick={()=>openChange(false)}>{"Annuler"}</Button>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default GroupDelete