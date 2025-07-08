"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AgentQuery from "@/queries/agent";
import { Agent } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader, Trash2 } from "lucide-react";
import React from "react";

type Props = {
  agent: Agent;
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
};

function DeleteDriver({ agent, isOpen, openChange }: Props) {
  const queryClient = useQueryClient();
  const agentQuery = new AgentQuery();
  const deleteAgent = useMutation({
    mutationFn: (id: number) => agentQuery.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["agents"],
        refetchType: "active",
      });
      openChange(false);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Supprimer le livreur ${agent.user?.name}`}</DialogTitle>
          <DialogDescription>
            {"Êtes-vous sûr de vouloir supprimer ce livreur"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button
            variant={"destructive"}
            onClick={() => {
              deleteAgent.mutate(agent.id);
            }}
            disabled={deleteAgent.isPending}
          >
            {deleteAgent.isPending ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}{" "}
            {"Supprimer"}
          </Button>
          <Button variant={"outline"} onClick={() => openChange(false)}>
            {"Annuler"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteDriver;
