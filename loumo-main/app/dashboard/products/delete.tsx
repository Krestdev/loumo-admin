'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProductQuery from '@/queries/product';
import { Product } from '@/types/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader, Trash2 } from 'lucide-react';
import React from 'react'

type Props = {
    product: Product;
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
};

function DeleteProduct({ product, isOpen, openChange }: Props) {
    const queryClient = useQueryClient();
    const actions = new ProductQuery();
    const deleteProduct = useMutation({
        mutationFn: (id:number)=> actions.delete(id),
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
                <DialogTitle>{`Supprimer ${product.name}`}</DialogTitle>
                <DialogDescription>{"Êtes-vous sûr de vouloir supprimer ce produit ?"}</DialogDescription>
            </DialogHeader>
            <div>
                <p className='text-gray-600 font-medium text-sm'>{"En supprimant ce produit, vous supprimerez également les variantes associées ainsi que leurs stocks."}</p>
            </div>
            <div className='flex justify-end gap-2'>
                <Button variant={"destructive"} onClick={()=>{deleteProduct.mutate(product.id)}} disabled={deleteProduct.isPending}>{ deleteProduct.isPending ? <Loader size={16}/> : <Trash2 size={16}/>} {"Supprimer"}</Button>
                <Button variant={"outline"} onClick={()=>openChange(false)}>{"Annuler"}</Button>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default DeleteProduct