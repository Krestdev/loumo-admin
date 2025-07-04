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
import { Label } from "@/components/ui/label";
import AgentQuery from "@/queries/agent";
import DeliveryQuery from "@/queries/delivery";
import { Agent, Order, Zone } from "@/types/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader, Loader2 } from "lucide-react";
import React from "react";

type Props = {
  order: Order;
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  zones: Zone[];
};

function AssignDriver({ order, isOpen, openChange, zones }: Props) {
  const agentQuery = new AgentQuery();
  const getAgents = useQuery({
    queryKey: ["agents"],
    queryFn: () => agentQuery.getAll(),
    refetchOnWindowFocus: false,
  });

  const deliveryQuery = new DeliveryQuery();
  const createDelivery = useMutation({
    mutationFn: (agentId:number) => deliveryQuery.create({
      agentId,
      orderId: order.id
    }),
    onSuccess: () => {
      openChange(false);
    }
  })

  const [drivers, setDrivers] = React.useState<Agent[]>([]);
  const [selected, setSelected] = React.useState<number>();

  React.useEffect(() => {
    if (getAgents.isSuccess) {
      setDrivers(getAgents.data);
    }
  }, [setDrivers, getAgents.data, getAgents.isSuccess]);

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{"Assigner un livreur"}</DialogTitle>
          <DialogDescription>
            {`Sélectionnez un livreur pour la commande ${order.id}`}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-medium">{"Détails de la commande"}</p>
            <p className="text-sm text-muted-foreground">
              {`Client: ${order.user?.name ?? "Non défini"}`}
            </p>
            <p className="text-sm text-muted-foreground">
              {`Zone: ${zones.find(x=>x.id === order.address?.id)?.name ?? "Non défini"}`}
            </p>
            <p className="text-sm text-muted-foreground">
              {`Poids: ${order.weight}kg`}
            </p>
          </div>

          <div className="space-y-2">
            <Label>{"Livreurs disponibles"}</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {getAgents.isLoading ? (
                <div className="h-12 w-full flex items-center justify-center">
                  <Loader2 className="animate-spin text-green-600" size={20} />
                </div>
              ) : drivers.filter(
                  (driver) =>
                    driver.zone.id === order.address?.zoneId &&
                    driver.status === "AVAILABLE"
                ).length > 0 ? (
                drivers
                  .filter(
                    (driver) =>
                      driver.zone.id === order.address?.zoneId &&
                      driver.status === "AVAILABLE"
                  )
                  .map((driver) => (
                    <Button
                      key={driver.id}
                      variant={"ghost"}
                      className="w-full flex items-center justify-between h-14 border rounded-lg hover:bg-muted cursor-pointer"
                      onClick={() => {
                        setSelected(driver.id)
                        createDelivery.mutate(driver.id);
                      }}
                      disabled={createDelivery.isPending}
                    >
                      <div className="flex flex-col text-start">
                        <p className="font-medium">
                          {driver.user?.name ?? "Non défini"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {driver.zone.name}
                        </p>
                      </div>
                      { (createDelivery.isPending && driver.id === selected ) ? <Loader size={16} className="animate-spin text-primary"/> : <Badge variant="default">{driver.status}</Badge>}
                    </Button>
                  ))
              ) : (
                <div className="w-full flex items-center text-muted-foreground italic">
                  {"Aucun livreur correspondant"}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => openChange(false)}>
            {"Annuler"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AssignDriver;
