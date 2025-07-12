"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SettingQuery from "@/queries/setting";
import { Setting } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader, Trash2 } from "lucide-react";

type Props = {
  setting: Setting;
  isOpen: boolean;
  openChange: (open: boolean) => void;
};

export default function DeletePageModal({ setting, isOpen, openChange }: Props) {
  const queryClient = useQueryClient();
  const settingQuery = new SettingQuery();

  const deletePage = useMutation({
    mutationFn: () => settingQuery.delete(setting.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      openChange(false);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{"Supprimer la page"}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {"Êtes-vous sûr de vouloir supprimer cette page "}<strong>{setting.name}</strong>{" ?"}<br/>
          {"Cette action est irréversible."}
        </p>

        <DialogFooter className="mt-4">
          <Button
            variant="destructive"
            onClick={() => deletePage.mutate()}
            disabled={deletePage.isPending}
          >
            {deletePage.isPending ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
            {"Supprimer"}
          </Button>
          <Button variant="outline" onClick={() => openChange(false)}>
            {"Annuler"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
