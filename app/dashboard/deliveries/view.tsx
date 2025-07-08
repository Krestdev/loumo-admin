"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Agent, Delivery } from "@/types/types";
import { Clock, MapPin, Navigation, Package, Phone, User } from "lucide-react";
import React from "react";

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  delivery: Delivery;
  agents: Agent[];
}

function ViewDelivery({isOpen, openChange, delivery, agents}:Props) {
  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {`Détails de la livraison`}
          </DialogTitle>
          <DialogDescription>
            {"Informations complètes sur la livraison"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-4">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Package size={16} />
                {"Informations commande"}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{"Commande:"}</span>
                  <span className="font-medium">
                    {delivery.orderId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{"Code suivi:"}</span>
                  <span className="font-mono">
                    {delivery.trackingCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{"Poids:"}</span>
                  <span>{`${delivery.order?.weight} kg`}</span>
                </div>
                <div className="flex justify-between">
                  <span>{"Articles:"}</span>
                  <span>
                    {`${delivery.order?.orderItems?.length} produits`}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <MapPin size={16} />
                {"Adresse de livraison"}
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="font-medium">
                    {delivery.order?.user.name}
                  </p>
                  <p>{delivery.order?.address?.street}</p>
                  <p className="text-muted-foreground">
                    {delivery.order?.address?.zone?.name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          { agents.find(x=> x.id === delivery.agentId) && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <User size={16} />
                {"Livreur assigné"}
              </h4>
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-medium">
                    {agents.find(x=> x.id === delivery.agentId)?.user?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {agents.find(x=> x.id === delivery.agentId)?.user?.tel ?? "Non renseigné"}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs">
                      {`Note: ${agents.find(x=> x.id === delivery.agentId)?.code}/5`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Clock size={16} />
              {"Horaires"}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{"Heure prévue:"}</span>
                <span>
                  {new Date(
                    delivery ? delivery.scheduledTime : ""
                  ).toLocaleString()}
                </span>
              </div>
              {delivery.estimatedArrival && (
                <div className="flex justify-between">
                  <span>{"Arrivée estimée:"}</span>
                  <span>
                    {new Date(
                      delivery.estimatedArrival
                    ).toLocaleString()}
                  </span>
                </div>
              )}
              {delivery.deliveredTime && (
                <div className="flex justify-between">
                  <span>{"Livré à:"}</span>
                  <span className="text-green-600">
                    {new Date(
                      delivery.deliveredTime ?? ""
                    )?.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button disabled>
              <Navigation size={16} />
              {"Suivre en temps réel"}
            </Button>
            <a href={agents.find(x=> x.id === delivery.agentId)?.user?.tel ? `tel:${agents.find(x=> x.id === delivery.agentId)?.user?.tel}` : "#"}>
            <Button variant="outline" disabled={!agents.find(x=> x.id === delivery.agentId)}>
              <Phone size={16} />
              {"Contacter livreur"}
            </Button>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ViewDelivery;
