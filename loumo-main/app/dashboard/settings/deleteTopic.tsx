'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TopicQuery from '@/queries/topic';
import { Topic } from '@/types/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader, Trash2 } from 'lucide-react';
import React from 'react';

type Props = {
  topic: Topic;
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
};

function DeleteTopic({ topic, isOpen, openChange }: Props) {
    const queryClient = useQueryClient();
    const actions = new TopicQuery();
    const deleteTopic = useMutation({
        mutationFn: (id:number)=> actions.delete(id),
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ["topics"], refetchType: "active"});
            openChange(false);
        }
    })
  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
                <DialogTitle>{`Supprimer ${topic.name}`}</DialogTitle>
                <DialogDescription>{"Êtes-vous sûr de vouloir supprimer cette section ?"}</DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
                <Button variant={"destructive"} onClick={()=>{deleteTopic.mutate(topic.id)}} disabled={deleteTopic.isPending}>{ deleteTopic.isPending ? <Loader size={16}/> : <Trash2 size={16}/>} {"Supprimer"}</Button>
                <Button variant={"outline"} onClick={()=>openChange(false)}>{"Annuler"}</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default DeleteTopic