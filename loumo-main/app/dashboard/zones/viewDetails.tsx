"use client";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
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

        <div className="space-y-3 mt-4 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-gray-900">{"Nom"}</p>
            <p>{zone.name}</p>
          </div>

          <div>
            <p className="font-medium text-gray-700">{"Description"}</p>
            <p>{zone.description || "Aucune description"}</p>
          </div>

          <div>
            <p className="font-medium text-sky-700">{"Frais de livraison"}</p>
            <p>{XAF.format(zone.price)}</p>
          </div>

          <div>
            <p className="font-medium text-gray-900">{"Statut"}</p>
            <Badge
              className={`text-xs px-2 py-0.5 rounded-md ${statusColor[zone.status]}`}
            >
              {statusMap[zone.status] ?? zone.status}
            </Badge>
          </div>

          <Separator />

          <div>
            <p className="font-medium text-gray-900 mb-1">{"Quartiers associés"}</p>
            {zone.addresses?.length > 0 ? (
              <ul className="list-disc ml-5">
                {zone.addresses.map((addr) => (
                  <li key={addr.id}>{addr.street}</li>
                ))}
              </ul>
            ) : (
              <p>{"Aucun quartier lié à cette zone."}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewZoneDetails;
