'use client'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import RoleQuery from '@/queries/role';
import { Role } from '@/types/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader, Trash2 } from 'lucide-react';
import React from 'react';

type Props = {
  role: Role;
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
};

function DeleteRole({role, isOpen, openChange}:Props) {
    const queryClient = useQueryClient();
    const actions = new RoleQuery();
    const deleteRole = useMutation({
        mutationFn: (id:number)=> actions.delete(id),
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ["roles"], refetchType: "active"});
            openChange(false);
        }
    });
  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
                <DialogTitle>{`Supprimer le rôle ${role.name}`}</DialogTitle>
                <DialogDescription>{"Êtes-vous sûr de vouloir supprimer ce rôle ?"}</DialogDescription>
            </DialogHeader>
            <div className='flex justify-end gap-2'>
                <Button variant={"destructive"} onClick={()=>{deleteRole.mutate(role.id)}} disabled={deleteRole.isPending}>{ deleteRole.isPending ? <Loader size={16} className='animate-spin'/> : <Trash2 size={16}/>} {"Supprimer"}</Button>
                <Button variant={"outline"} onClick={()=>openChange(false)}>{"Annuler"}</Button>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default DeleteRole