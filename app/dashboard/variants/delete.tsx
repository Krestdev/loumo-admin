import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProductVariantQuery from '@/queries/productVariant';
import { Product, ProductVariant } from '@/types/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader, Trash2 } from 'lucide-react';
import React from 'react'

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  variant: ProductVariant;
  products:Product[];
};

function DeleteVariant({isOpen, openChange, variant, products}:Props) {
    const queryClient = useQueryClient();
    const actions = new ProductVariantQuery();
    const deleteVariant = useMutation({
        mutationFn: (id:number) => actions.delete(id),
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ["variants"], refetchType: "active"});
            openChange(false);
        }
    })
  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
                <DialogTitle>{`Supprimer ${variant.name} - ${products.find(x=>x.id === variant.productId)?.name}`}</DialogTitle>
                <DialogDescription>{"Êtes-vous sûr de vouloir supprimer ce variant ?"}</DialogDescription>
            </DialogHeader>
            <div className='flex justify-end gap-2'>
                <Button variant={"destructive"} onClick={()=>{deleteVariant.mutate(variant.id)}} disabled={deleteVariant.isPending}>{ deleteVariant.isPending ? <Loader size={16}/> : <Trash2 size={16}/>} {"Supprimer"}</Button>
                <Button variant={"outline"} onClick={()=>openChange(false)}>{"Annuler"}</Button>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default DeleteVariant