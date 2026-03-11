'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ZoneQuery from '@/queries/zone';
import { Zone } from '@/types/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader, Trash2 } from 'lucide-react';
import React from 'react';

type Props = {
    zone: Zone;
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
};

function DeleteZone({ zone, isOpen, openChange }: Props) {
    const queryClient = useQueryClient();
    const actions = new ZoneQuery();
    const deleteZoneQuery = useMutation({
        mutationFn: (id:number)=> actions.delete(id),
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ["zones"], refetchType: "active"});
            queryClient.invalidateQueries({queryKey: ["shops"], refetchType: "active"});
            openChange(false);
        }
    })
  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
                <DialogTitle>{`Supprimer ${zone.name}`}</DialogTitle>
                <DialogDescription>{"Êtes-vous sûr de vouloir supprimer cette zone ?"}</DialogDescription>
            </DialogHeader>
            <div className='flex justify-end gap-2'>
                <Button variant={"destructive"} onClick={()=>{deleteZoneQuery.mutate(zone.id)}} disabled={deleteZoneQuery.isPending}>{ deleteZoneQuery.isPending ? <Loader size={16}/> : <Trash2 size={16}/>} {"Supprimer"}</Button>
                <Button variant={"outline"} onClick={()=>openChange(false)}>{"Annuler"}</Button>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default DeleteZone