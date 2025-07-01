'use client'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CategoryQuery from '@/queries/category';
import { Category } from '@/types/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader, Trash2 } from 'lucide-react';
import React from 'react';

type Props = {
  category: Category;
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
};

function DeleteCategory({category, isOpen, openChange}:Props) {
    const queryClient = useQueryClient();
    const actions = new CategoryQuery();
    const deleteCategory = useMutation({
        mutationFn: (id:number)=> actions.delete(id),
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ["categories"], refetchType: "active"});
            openChange(false);
        }
    });
  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
                <DialogTitle>{`Supprimer ${category.name}`}</DialogTitle>
                <DialogDescription>{"Êtes-vous sûr de vouloir supprimer cette catégorie ?"}</DialogDescription>
            </DialogHeader>
            <div className='flex justify-end gap-2'>
                <Button variant={"destructive"} onClick={()=>{deleteCategory.mutate(category.id)}} disabled={deleteCategory.isPending}>{ deleteCategory.isPending ? <Loader size={16}/> : <Trash2 size={16}/>} {"Supprimer"}</Button>
                <Button variant={"outline"} onClick={()=>openChange(false)}>{"Annuler"}</Button>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default DeleteCategory