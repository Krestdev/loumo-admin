import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { XAF } from "@/lib/utils";
import { Address, Shop } from "@/types/types";
import React from "react";

interface Props {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  store: Shop;
  address?: Address;
  CA: number;
}

function ViewStore({ isOpen, openChange, store, address, CA }: Props) {

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{`Point de vente : ${store.name}`}</DialogTitle>
                <DialogDescription>{"Informations relatives au point de vente"}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <span className="text-gray-600">{"Nom du point de vente"}</span>
                        <span className="text-gray-900 font-medium">{store.name}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-gray-600">{"Adresse"}</span>
                        <span className="text-gray-900 font-medium">{!!address ? address.street : "Non défini"}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-gray-600">{"Chiffre d'Affaires"}</span>
                        <span className="text-gray-900 font-medium">{XAF.format(CA)}</span>
                    </div>
                </div>
                <DialogClose asChild className="mt-4">
                    <Button variant={"outline"}>{"Fermer"}</Button>
                </DialogClose>
        </DialogContent>
    </Dialog>
  );
}

export default ViewStore;
