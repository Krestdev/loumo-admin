'use client'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import UserQuery from '@/queries/user';
import { User } from '@/types/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader, Trash2 } from 'lucide-react';
import React from 'react'

type Props = {
  client: User;
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
};

function BanClient({client, isOpen, openChange}:Props) {

    const clientQuery = new UserQuery();
    const queryClient = useQueryClient();
    const updateUser = useMutation({
        mutationFn: () => clientQuery.update(client.id, {active: !client.active}),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["clients"], refetchType: "active"});
            openChange(false);
        }
    })

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
                <DialogTitle>{client.active ? `Bannir ${client.name}` : `Débannir ${client.name}`}</DialogTitle>
                <DialogDescription>{client.active ? "Êtes-vous sûr de vouloir bannir ce client ?" : "Êtes-vous sûr de vouloir débannir ce client ?"}</DialogDescription>
            </DialogHeader>
            <div className='flex justify-end gap-2'>
                <Button variant={client.active ? "destructive" : "default"} onClick={()=>{updateUser.mutate()}} disabled={updateUser.isPending}>{ updateUser.isPending ? <Loader size={16} className='animate-spin'/> : client.active && <Trash2 size={16}/>} {client.active ? "Bannir" : "Débannir"}</Button>
                <Button variant={"outline"} onClick={()=>openChange(false)}>{"Annuler"}</Button>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default BanClient