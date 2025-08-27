import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ShopQuery from '@/queries/shop';
import { Shop } from '@/types/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader, Trash2 } from 'lucide-react';
import React from 'react';

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  store: Shop;
};

function DeleteStore({isOpen, openChange, store}:Props) {
    const queryClient = useQueryClient();
    const actions = new ShopQuery();
    const deleteStore = useMutation({
        mutationFn: (id:number) => actions.delete(id),
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ["shops"], refetchType: "active"});
            queryClient.invalidateQueries({queryKey: ["zones"], refetchType: "active"});
            openChange(false);
        }
    })
  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
                <DialogTitle>{`Supprimer ${store.name}`}</DialogTitle>
                <DialogDescription>{"Êtes-vous sûr de vouloir supprimer ce Point de vente ?"}</DialogDescription>
            </DialogHeader>
            <div className='flex justify-end gap-2'>
                <Button variant={"destructive"} onClick={()=>{deleteStore.mutate(store.id)}} disabled={deleteStore.isPending}>{ deleteStore.isPending ? <Loader size={16}/> : <Trash2 size={16}/>} {"Supprimer"}</Button>
                <Button variant={"outline"} onClick={()=>openChange(false)}>{"Annuler"}</Button>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default DeleteStore