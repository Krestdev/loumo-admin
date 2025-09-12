"use client";

import { DateRangePicker } from "@/components/dateRangePicker";
import PageLayout from "@/components/page-layout";
import StatCard from "@/components/statistic-Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
import { fetchAll } from "@/hooks/useData";
import { getDeliveryStatusName, getStatusColor } from "@/lib/utils";
import { useStore } from "@/providers/datastore";
import AgentQuery from "@/queries/agent";
import DeliveryQuery from "@/queries/delivery";
import OrderQuery from "@/queries/order";
import ZoneQuery from "@/queries/zone";
import { Agent, Delivery, DeliveryStatus, Order, statisticCard, Zone } from "@/types/types";
import { formatRelative } from "date-fns";
import { fr } from "date-fns/locale";
import { BadgeCheck, Ban, CheckCircle, Edit, Ellipsis, Eye, Filter, Package, Search, Store, Truck, User } from "lucide-react";
import React, { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import CancelDelivery from "./cancelDelivery";
import EditDelivery from "./edit";
import EndDelivery from "./end";
import ViewDelivery from "./view";



export default function DeliveriesPage() {
  const deliveriesQuery = new DeliveryQuery();
  const deliveryData = fetchAll(deliveriesQuery.getAll,"deliveries",60000);

  const agentQuery = new AgentQuery();
  const agentData = fetchAll(agentQuery.getAll,"agents",60000);

  const zoneQuery = new ZoneQuery();
  const getZones = fetchAll(zoneQuery.getAll,"zones",60000);

  const orderQuery = new OrderQuery();
  const getOrders = fetchAll(orderQuery.getAll, "orders", 60000);

  const { setLoading } = useStore();

  const [selected, setSelected] = useState<Delivery>();
  const [viewMore, setViewMore] = useState(false);
  const [edit, setEdit] = useState(false);
  const [completeDialog, setCompleteDialog] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [zonesFilter, setZonesFilter] = useState("all");
  const [agentFilter, setAgentFilter] = useState("all"); //Filtre livreur
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const statusArray:Delivery["status"][] = ["CANCELED", "COMPLETED", "NOTSTARTED", "STARTED"];

  React.useEffect(() => {
    setLoading(
      getZones.isLoading || deliveryData.isLoading || agentData.isLoading || getOrders.isLoading
    );
    if (deliveryData.isSuccess) {
      setDeliveries(deliveryData.data);
    }
    if (agentData.isSuccess) {
      setAgents(agentData.data);
    }
    if (getZones.isSuccess) {
      setZones(getZones.data);
    }
    if (getOrders.isSuccess) {
      setOrders(getOrders.data);
    }
  }, [
    setLoading,
    setDeliveries,
    setAgents,
    setZones,
    setOrders,
    deliveryData.isSuccess,
    deliveryData.data,
    deliveryData.isLoading,
    agentData.isLoading,
    agentData.data,
    agentData.isSuccess,
    getZones.data,
    getZones.isLoading,
    getZones.isSuccess,
    getOrders.data,
    getOrders.isLoading,
    getOrders.isSuccess,
  ]);

  const filteredDeliveries = useMemo(()=>{
    return deliveries.filter((delivery) => {
      const deliveryDate = !!delivery.deliveredTime ? new Date(delivery.deliveredTime) : new Date(delivery.scheduledTime);
      //Search
    const matchesSearch =
      delivery.order?.user.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      delivery.orderId === parseInt(searchTerm.toLowerCase()) ||
      delivery.order?.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.ref.toLowerCase().includes(searchTerm.toLowerCase());
      //Status
    const matchesStatus =
      statusFilter === "all" || delivery.status === statusFilter;
      //Zones
    const matchesZones =
      zonesFilter === "all" ||
      delivery.order?.address?.zoneId === Number(zonesFilter) ;
      //Period
      const matchesDate =
      (!dateRange?.from || deliveryDate >= new Date(dateRange.from.setHours(0, 0, 0, 0))) &&
      (!dateRange?.to || deliveryDate <= new Date(dateRange.to.setHours(23, 59, 59, 999)));

      const matchesAgent =
      agentFilter === "all" || agentFilter === String(delivery.agentId);

    return matchesSearch && matchesStatus && matchesZones && matchesDate && matchesAgent;
  });
  },[deliveries, statusFilter, zonesFilter, searchTerm, dateRange, agentFilter]);
  

  const handleView = (delivery: Delivery) => {
    setSelected(delivery);
    setViewMore(true);
  };

  const handleEdit = (delivery: Delivery) => {
    setSelected(delivery);
    setEdit(true);
  };

  const handleComplete = (delivery: Delivery) => {
    setSelected(delivery);
    setCompleteDialog(true);
  };

  const handleCancel = (delivery: Delivery) => {
    setSelected(delivery);
    setCancelDialog(true);
  }

  const statusName = (status :DeliveryStatus):string => {
    switch(status){
      case "CANCELED":
        return "Annulé";
      case "COMPLETED":
        return "Terminé";
      case "NOTSTARTED":
        return "En attente";
      case "STARTED":
        return "En cours";
      default :
      return "Inconnu";
    }
  }

  const statistics:statisticCard[] = [
    {
      title: "Livraison en cours",
      icon: <Truck className="h-4 w-4 text-green-500" />,
      value: deliveries.filter((x) => x.status === "STARTED").length
    },
    {
      title: "Total livraisons",
      icon: <Package className="h-4 w-4 text-muted-foreground" />,
      value: filteredDeliveries.length,
      sub: {
        title: "Livraisons terminées",
        value: filteredDeliveries.filter(x=>x.status === "COMPLETED").length
      }
    },
    {
      title: "Livreurs actifs",
      icon: <User className="h-4 w-4 text-ternary" />,
      value: agents.filter((x) => x.status === "AVAILABLE" || x.status === "FULL").length,
      sub: {
        title: "Livreurs disponibles",
        value: agents.filter(x=>x.status === "AVAILABLE").length
      }
    }
  ];

  return (
    <PageLayout
      isLoading={
        getZones.isLoading || deliveryData.isLoading || agentData.isLoading || getOrders.isLoading
      }
      className="flex-1 overflow-auto p-4 space-y-6"
    >
      {/**Filtres */}
      <div className="p-6 w-full bg-white rounded-lg grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 shadow-sm">
        <h4 className="font-semibold text-sm sm:text-base flex gap-2 items-center"><Filter size={16}/> {"Filtres"}</h4>
        <div className="col-span-1 sm:col-span-3 lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="font-medium text-sm">{"Recherche"}</label>
            <DateRangePicker date={dateRange} onChange={setDateRange} />
          </div>
          <div className="space-y-2">
            <label className="font-medium text-sm">{"Zone"}</label>
            <Select value={zonesFilter} onValueChange={setZonesFilter}>
              <SelectTrigger className="w-full">
                <Store size={16} />
                <SelectValue placeholder="Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{"Toutes les zones"}</SelectItem>
                {zones.map((x) => (
                  <SelectItem key={x.id} value={String(x.id)}>
                    {x.name}
                  </SelectItem>
                ))}
                {zones.length === 0 && <SelectItem value="disabled" disabled>{"Aucune zone enregistrée"}</SelectItem>}
              </SelectContent>
          </Select>
          </div>
          <div className="space-y-2">
            <label className="font-medium text-sm">{"Statut"}</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <BadgeCheck size={16}/>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"Tous"}</SelectItem>
                  {statusArray.map((x, i)=>
                    <SelectItem key={i} value={x}>{statusName(x)}</SelectItem>
                  )}
                </SelectContent>
              </Select>
          </div>
          <div className="space-y-2">
            <label className="font-medium text-sm">{"Livreur"}</label>
            <Select value={agentFilter} onValueChange={setAgentFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"Tous"}</SelectItem>
                  {agents.map((x, i)=>
                    <SelectItem key={i} value={String(x.id)}>{x.user?.name ?? "Non défini"}</SelectItem>
                  )}
                </SelectContent>
              </Select>
          </div>
        </div>
      </div>
      {/* Delivery Stats */}
      <div className="grid gap-4 grid-cols-1 @min-[540px]:grid-cols-2 @min-[860px]:grid-cols-3">
        {statistics.map((item, id)=><StatCard key={id} {...item}/>)}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{"Recherche"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px] max-w-lg">
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
                <TableHead>{"Ref"}</TableHead>
                <TableHead>{"Commande"}</TableHead>
                <TableHead>{"Livreur"}</TableHead>
                <TableHead>{"Client"}</TableHead>
                <TableHead>{"Zone"}</TableHead>
                <TableHead>{"Statut"}</TableHead>
                {/* <TableHead>{"Priorité"}</TableHead> */}
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
                        <p className="text-xs uppercase">{delivery.ref}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-xs uppercase">{orders.find(order=>order.id === delivery.orderId)?.ref ?? "Non défini"}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <strong>
                        {agents.find((x) => x.id === delivery.agentId)?.user
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
                        {getDeliveryStatusName(delivery.status)}
                      </Badge>
                    </TableCell>
                    {/* <TableCell>
                      <Badge variant={getPriorityColor(delivery.priority)}>
                        {delivery.priority}
                      </Badge>
                    </TableCell> */}
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size={"icon"} variant={"ghost"}>
                            <Ellipsis size={20}/>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={()=>{handleView(delivery)}}>
                            <Eye size={16}/>{"Voir les détails"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={()=>{handleEdit(delivery)}} disabled={delivery.status === "CANCELED" || delivery.status === "COMPLETED"}>
                            <Edit size={16} />{"Modifier la livraison"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={()=>{handleComplete(delivery)}} disabled={delivery.status === "CANCELED" || delivery.status === "COMPLETED"}>
                            <CheckCircle size={16} />{"Marquer terminée"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={()=>{handleCancel(delivery)}} disabled={delivery.status === "CANCELED" || delivery.status === "COMPLETED"} variant="destructive">
                            <Ban size={16} />{"Annuler la livraison"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
        orders={orders}
          isOpen={viewMore}
          openChange={setViewMore}
          delivery={selected}
          agents={agents}
        />
      )}
      {selected && (
        <EditDelivery
          isOpen={edit}
          openChange={setEdit}
          delivery={selected}
          agents={agents}
        />
      )}
      {selected && (
        <EndDelivery
          isOpen={completeDialog}
          openChange={setCompleteDialog}
          delivery={selected}
        />
      )}
      {selected && (
        <CancelDelivery
          isOpen={cancelDialog}
          openChange={setCancelDialog}
          delivery={selected}
        />
      )}
    </PageLayout>
  );
}
