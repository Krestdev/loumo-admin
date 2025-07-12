"use client";

import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Setting } from "@/types/types";
import { DialogDescription } from "@radix-ui/react-dialog";
import { format } from "date-fns";

type Props = {
  isOpen: boolean;
  openChange: (open: boolean) => void;
  page: Setting;
};

export default function ViewPageModal({ isOpen, openChange, page }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{`Page : ${page.name}`}</DialogTitle>
          <DialogDescription>
            {"Aperçu de la page ajoutée par l'administrateur"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">{"Section :"}</span>
            <Badge variant="outline">{page.section}</Badge>
            {page.date && (
              <>
                <span className="ml-4">{"Créée le :"}</span>
                <span>{format(new Date(page.date), "dd/MM/yyyy HH:mm")}</span>
              </>
            )}
          </div>

          {page.note && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">{"Meta description"}</p>
              <p className="text-sm bg-muted rounded px-3 py-2">{page.note}</p>
            </div>
          )}

          <div className="max-h-[400px] overflow-y-auto border rounded-md p-4">
            <div className="prose prose-sm max-w-full" dangerouslySetInnerHTML={{ __html: page.content ?? "<i>Aucun contenu</i>" }} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
