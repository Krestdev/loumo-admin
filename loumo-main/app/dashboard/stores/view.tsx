import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { XAF } from "@/lib/utils";
import { Shop, Zone } from "@/types/types";
import { DollarSign, Map, MapPinHouse, ShoppingBasket, Warehouse } from "lucide-react";
import React from "react";

interface Props {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  store: Shop;
  CA: number;
  totalOrders:number;
  zones: Zone[];
}

function ViewStore({ isOpen, openChange, store, CA, totalOrders, zones }: Props) {

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{`Point de vente : ${store.name}`}</DialogTitle>
                <DialogDescription>{"Informations relatives au point de vente"}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-600 flex items-center gap-2 text-sm"><Warehouse size={16} />{"Nom du point de vente"}</span>
                        <span className="text-gray-900 font-medium">{store.name}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-600 flex items-center gap-2 text-sm"><MapPinHouse size={16} />{"Adresse"}</span>
                        <span className="text-gray-900 font-medium">{store.address?.street ?? "Non défini"}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-600 flex items- gap-2 text-sm"><DollarSign size={16}/> {"Chiffre d'Affaires"}</span>
                        <span className="text-gray-900 font-medium">{XAF.format(CA)}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-600 flex items-center gap-2 text-sm"><ShoppingBasket size={16}/> {"Total de commandes"}</span>
                        <span className="text-gray-900 font-medium">{totalOrders}</span>
                    </div>
                    <div className="col-span-1 sm:col-span-2 flex flex-col gap-1">
                        <span className="text-gray-600 flex items-center gap-2 text-sm"><Map size={16}/> {"Zone desservie"}</span>
                        <span className="flex flex-wrap gap-1">{zones.find(y=>y.id === store.addressId)?.addresses.map(x=> (
                            <Badge variant={"outline"} key={x.id}>{x.street}</Badge>
                        ))}</span>
                    </div>
                </div>
                <DialogClose asChild className="mt-4">
                    <Button variant={"outline"} className="w-fit">{"Fermer"}</Button>
                </DialogClose>
        </DialogContent>
    </Dialog>
  );
}

export default ViewStore;
