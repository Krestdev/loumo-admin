"use client";

import PageLayout from "@/components/page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStore } from "@/providers/datastore";
import AgentQuery from "@/queries/agent";
import DeliveryQuery from "@/queries/delivery";
import ZoneQuery from "@/queries/zone";
import { Agent, Delivery, Zone } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { formatRelative } from "date-fns";
import { fr } from "date-fns/locale";
import { CheckCircle, Clock, Package, Search, Truck, User } from "lucide-react";
import React, { useState } from "react";
import EditDelivery from "./edit";
import EndDelivery from "./end";
import ViewDelivery from "./view";
import { getPriorityColor, getStatusColor } from "@/lib/utils";



export default function DeliveriesPage() {
  const deliveriesQuery = new DeliveryQuery();
  const deliveryData = useQuery({
    queryKey: ["deliveries"],
    queryFn: deliveriesQuery.getAll,
  });

  const agentQuery = new AgentQuery();
  const agentData = useQuery({
    queryKey: ["agents"],
    queryFn: agentQuery.getAll,
  });

  const zoneQuery = new ZoneQuery();
  const zoneData = useQuery({
    queryKey: ["zones"],
    queryFn: zoneQuery.getAll,
  });

  const { setLoading } = useStore();

  const [selected, setSelected] = useState<Delivery>();
  const [viewMore, setViewMore] = useState(false);
  const [edit, setEdit] = useState(false);
  const [actionDialog, setActionDialog] = useState(false);
  const [drivers, setDrivers] = useState<Agent[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");

  React.useEffect(() => {
    setLoading(
      zoneData.isLoading || deliveryData.isLoading || zoneData.isLoading
    );
    if (deliveryData.isSuccess) {
      setDeliveries(deliveryData.data);
    }
    if (agentData.isSuccess) {
      setDrivers(agentData.data);
    }
    if (zoneData.isSuccess) {
      setZones(zoneData.data);
    }
  }, [
    setLoading,
    setDeliveries,
    setDrivers,
    setZones,
    deliveryData.isSuccess,
    deliveryData.data,
    deliveryData.isLoading,
    agentData.isLoading,
    agentData.data,
    agentData.isSuccess,
    zoneData.data,
    zoneData.isLoading,
    zoneData.isSuccess,
  ]);

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.order?.user.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      delivery.orderId === parseInt(searchTerm.toLowerCase()) ||
      delivery.trackingCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || delivery.status === statusFilter;
    const matchesZone =
      zoneFilter === "all" ||
      delivery.order?.address?.zone?.name === zoneFilter;
    return matchesSearch && matchesStatus && matchesZone;
  });

  const handleView = (delivery: Delivery) => {
    setSelected(delivery);
    setViewMore(true);
  };

  const handleEdit = (delivery: Delivery) => {
    setSelected(delivery);
    setEdit(true);
  };

  const handleAction = (delivery: Delivery) => {
    setSelected(delivery);
    setActionDialog(true);
  };

  //Today deliveries logic
  const today = new Date();
  const todayDeliveries = deliveries.filter((x) => {
    if (!x.deliveredTime) return false;
    const delivered = new Date(x.deliveredTime);
    return (
      delivered.getDate() === today.getDate() &&
      delivered.getMonth() === today.getMonth() &&
      delivered.getFullYear() === today.getFullYear()
    );
  }).length;

  return (
    <PageLayout
      isLoading={
        zoneData.isLoading || deliveryData.isLoading || zoneData.isLoading
      }
      className="flex-1 overflow-auto p-4 space-y-6"
    >
      {/* Delivery Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{"En cours"}</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deliveries.filter((x) => x.status === "STARTED").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {"Livraisons actives"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Livrées aujourd'hui"}
            </CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayDeliveries}</div>
            {/* <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8</span> vs hier
              </p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps moyen</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42min</div>
            <p className="text-xs text-muted-foreground">Temps de livraison</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Livreurs actifs"}
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                drivers.filter(
                  (x) => x.status === "AVAILABLE" || x.status === "FULL"
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {`Sur ${drivers.length} disponibles`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{"Filtres"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par client, commande ou code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="En attente">En attente</SelectItem>
                <SelectItem value="En cours">En cours</SelectItem>
                <SelectItem value="En route">En route</SelectItem>
                <SelectItem value="Livré">Livré</SelectItem>
              </SelectContent>
            </Select>
            <Select value={zoneFilter} onValueChange={setZoneFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{"Toutes les zones"}</SelectItem>
                {zones.map((x) => (
                  <SelectItem key={x.id} value={x.name}>
                    {x.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Deliveries Table */}
      <Card>
        <CardHeader>
          <CardTitle>{`Livraisons (${filteredDeliveries.length})`}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{"Référence"}</TableHead>
                <TableHead>{"Livreur"}</TableHead>
                <TableHead>{"Client"}</TableHead>
                <TableHead>{"Zone"}</TableHead>
                <TableHead>{"Statut"}</TableHead>
                <TableHead>{"Priorité"}</TableHead>
                <TableHead>{"Heure prévue"}</TableHead>
                <TableHead>{"Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeliveries.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-gray-500 py-5 sm:text-lg xl:text-xl"
                  >
                    {"Aucune Livraison trouvée"}
                    <img
                      src={"/images/search.png"}
                      alt="no-image"
                      className="w-1/3 max-w-32 h-auto mx-auto mt-5 opacity-20"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                filteredDeliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell>
                      <div>
                        <p className="text-xs">{delivery.trackingCode}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <strong>
                        {drivers.find((x) => x.id === delivery.agentId)?.user
                          ?.name ?? "Introuvable"}
                      </strong>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {delivery.order?.user.name ?? "Non renseigné"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {delivery.order?.address?.street ?? "Non renseigné"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {delivery.order?.address?.zone?.name ?? "Non défini"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(delivery.status)}>
                        {delivery.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityColor(delivery.priority)}>
                        {delivery.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">
                          {formatRelative(
                            new Date(delivery.scheduledTime),
                            new Date(), // maintenant
                            { locale: fr }
                          )}
                        </p>
                        {delivery.estimatedArrival && (
                          <p className="text-xs text-muted-foreground">
                            ETA:{" "}
                            {new Date(
                              delivery.estimatedArrival
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant={"outline"}
                          onClick={() => {
                            handleView(delivery);
                          }}
                        >
                          {"Voir"}
                        </Button>
                        {delivery.status !== "CANCELED" &&
                          delivery.status !== "COMPLETED" && (
                            <Button
                              variant={"secondary"}
                              onClick={() => {
                                handleEdit(delivery);
                              }}
                            >
                              {"Modifier"}
                            </Button>
                          )}
                        {delivery.status !== "CANCELED" &&
                          delivery.status !== "COMPLETED" && (
                            <Button
                              variant={"success"}
                              size={"icon"}
                              onClick={() => {
                                handleAction(delivery);
                              }}
                            >
                              <CheckCircle size={16} />
                            </Button>
                          )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selected && (
        <ViewDelivery
          isOpen={viewMore}
          openChange={setViewMore}
          delivery={selected}
          agents={drivers}
        />
      )}
      {selected && (
        <EditDelivery
          isOpen={edit}
          openChange={setEdit}
          delivery={selected}
          agents={drivers}
        />
      )}
      {selected && (
        <EndDelivery
          isOpen={actionDialog}
          openChange={setActionDialog}
          delivery={selected}
        />
      )}
    </PageLayout>
  );
}
