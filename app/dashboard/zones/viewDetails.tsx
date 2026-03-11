"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { XAF } from "@/lib/utils";
import { Zone } from "@/types/types";
import { FC } from "react";

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  zone: Zone;
};

const statusMap: Record<string, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  PENDING: "En attente",
  DISABLED: "Désactivée",
};

const statusColor: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  INACTIVE: "bg-gray-100 text-gray-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  DISABLED: "bg-red-100 text-red-800",
};

const ViewZoneDetails: FC<Props> = ({ isOpen, openChange, zone }) => {
  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{"Détails de la zone"}</DialogTitle>
          <DialogDescription>
            {"Informations complètes sur "}<strong>{zone.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className=" text-gray-600">{"Nom"}</p>
            <p className="font-semibold">{zone.name}</p>
          </div>

          <div>
            <p className="text-gray-600">{"Description"}</p>
            <p className="font-semibold">{zone.description || "Aucune description"}</p>
          </div>

          <div>
            <p className="text-gray-600">{"Frais de livraison"}</p>
            <p className="font-semibold">{XAF.format(zone.price)}</p>
          </div>

          <div>
            <p className="text-gray-600">{"Statut"}</p>
            <Badge
              className={`text-xs px-2 py-0.5 rounded-md ${statusColor[zone.status]}`}
            >
              {statusMap[zone.status] ?? zone.status}
            </Badge>
          </div>
          <div className="col-span-1 sm:col-span-2 flex flex-col gap-1">
            <p className="text-gray-600">{"Quartiers associés"}</p>
            {zone.addresses?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {zone.addresses.map((addr) => (
                  <Badge variant={"outline"} key={addr.id}>{addr.street}</Badge>
                ))}
              </div>
            ) : (
              <p className="italic">{"Aucun quartier lié à cette zone."}</p>
            )}
          </div>
        </div>
        <DialogClose asChild className="mt-4">
          <Button variant={"outline"} className="w-fit">{"Fermer"}</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default ViewZoneDetails;
