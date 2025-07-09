"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Address, Zone } from "@/types/types";
import React from "react";

type Props = {
  address: Address;
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  zones: Zone[];
};


function ViewAddressDetails({ address, isOpen, openChange, zones }: Props) {

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`${address.local} - ${address.street}`}</DialogTitle>
          <DialogDescription>
            {"Consultez les informations associées"}
          </DialogDescription>
        </DialogHeader>
          <div className="space-y-6">
            <div className="grid gap-2 p-4 bg-white shadow-md rounded-md">
                <p className="text-gray-900 font-semibold flex gap-2"><span className="font-light text-gray-600">{"Nom du quartier"}</span>{address.local}</p>
                <p className="text-gray-900 font-semibold flex gap-2"><span className="font-light text-gray-600">{"Nom de la rue"}</span>{address.street}</p>
            </div>
            <div className="flex gap-2 flex-col p-4 bg-white shadow-md rounded-md">
                <p className="font-medium">{"Description"}</p>
                <p className="italic text-gray-700">{address.description ?? "Aucune description"}</p>
            </div>
            <div className="grid gap-2 p-4 bg-white shadow-md rounded-md">
                <p className="text-gray-900 font-semibold flex gap-2"><span className="font-light text-gray-600">{"Zone"}</span>{zones.find(x=>x.id === address.zoneId)?.name ?? "Non défini"}</p>
                <p className="text-gray-900 font-semibold flex gap-2"><span className="font-light text-gray-600">{"Statut"}</span><Badge variant={address.published ? "default" : "destructive"}>{address.published ? "Actif" : "Désactivé"}</Badge></p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant={"outline"}
                onClick={(e) => {
                  e.preventDefault();
                  openChange(false);
                }}
              >
                {"Annuler"}
              </Button>
            </div>
          </div>
      </DialogContent>
    </Dialog>
  );
}

export default ViewAddressDetails;
