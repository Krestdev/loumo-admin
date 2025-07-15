"use client";

import { DateRangePicker } from "@/components/dateRangePicker";
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
import { fetchAll } from "@/hooks/useData";
import { getPriorityColor, getStatusColor } from "@/lib/utils";
import { useStore } from "@/providers/datastore";
import AgentQuery from "@/queries/agent";
import DeliveryQuery from "@/queries/delivery";
import ShopQuery from "@/queries/shop";
import { Agent, Delivery, Shop } from "@/types/types";
import { formatRelative } from "date-fns";
import { fr } from "date-fns/locale";
import { BadgeCheck, CheckCircle, Clock, Filter, Package, Search, Store, Truck, User } from "lucide-react";
import React, { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import EditDelivery from "./edit";
import EndDelivery from "./end";
import ViewDelivery from "./view";



export default function DeliveriesPage() {
  const deliveriesQuery = new DeliveryQuery();
  const deliveryData = fetchAll(deliveriesQuery.getAll,"deliveries",60000);

  const agentQuery = new AgentQuery();
  const agentData = fetchAll(agentQuery.getAll,"agents",60000);

  const shopQuery = new ShopQuery();
  const getShops = fetchAll(shopQuery.getAll,"shops",60000);

  const { setLoading } = useStore();

  const [selected, setSelected] = useState<Delivery>();
  const [viewMore, setViewMore] = useState(false);
  const [edit, setEdit] = useState(false);
  const [actionDialog, setActionDialog] = useState(false);
  const [drivers, setDrivers] = useState<Agent[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [shopFilter, setShopFilter] = useState("all");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const statusArray:Delivery["status"][] = ["CANCELED", "COMPLETED", "NOTSTARTED", "STARTED"];

  React.useEffect(() => {
    setLoading(
      getShops.isLoading || deliveryData.isLoading || agentData.isLoading
    );
    if (deliveryData.isSuccess) {
      setDeliveries(deliveryData.data);
    }
    if (agentData.isSuccess) {
      setDrivers(agentData.data);
    }
    if (getShops.isSuccess) {
      setShops(getShops.data);
    }
  }, [
    setLoading,
    setDeliveries,
    setDrivers,
    setShops,
    deliveryData.isSuccess,
    deliveryData.data,
    deliveryData.isLoading,
    agentData.isLoading,
    agentData.data,
    agentData.isSuccess,
    getShops.data,
    getShops.isLoading,
    getShops.isSuccess,
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
      delivery.trackingCode.toLowerCase().includes(searchTerm.toLowerCase());
      //Status
    const matchesStatus =
      statusFilter === "all" || delivery.status === statusFilter;
      //Shop
    const matchesShop =
      shopFilter === "all" ||
      delivery.order?.address?.zoneId === Number(shopFilter);
      //Period
      const matchesDate =
      (!dateRange?.from || deliveryDate >= new Date(dateRange.from.setHours(0, 0, 0, 0))) &&
      (!dateRange?.to || deliveryDate <= new Date(dateRange.to.setHours(23, 59, 59, 999)));
    return matchesSearch && matchesStatus && matchesShop && matchesDate;
  });
  },[deliveries, statusFilter, shopFilter, searchTerm, dateRange]);
  

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

  const statusName = (status :Delivery["status"]):string => {
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

  return (
    <PageLayout
      isLoading={
        getShops.isLoading || deliveryData.isLoading || agentData.isLoading
      }
      className="flex-1 overflow-auto p-4 space-y-6"
    >
      {/**Filtres */}
      <div className="p-6 w-full bg-white rounded-lg flex flex-wrap justify-between items-center gap-4 sm:gap-6 shadow-sm">
        <h4 className="font-semibold text-sm sm:text-base flex gap-2 items-center"><Filter size={16}/> {"Filtres"}</h4>
        <div className="flex gap-3 flex-wrap">
          <DateRangePicker date={dateRange} onChange={setDateRange} />
            <Select value={shopFilter} onValueChange={setShopFilter}>
            <SelectTrigger>
              <Store size={16} />
              <SelectValue placeholder="Point de vente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{"Toutes les boutiques"}</SelectItem>
              {shops.map((x) => (
                <SelectItem key={x.id} value={String(x.id)}>
                  {x.name}
                </SelectItem>
              ))}
              {shops.length === 0 && <SelectItem value="disabled" disabled>{"Aucune boutique"}</SelectItem>}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="max-w-[150px]">
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
      </div>
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
              {"Total livraisons"}
            </CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredDeliveries.filter(x=>x.status === "COMPLETED").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{"Temps moyen"}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{"--"}</div>
            <p className="text-xs text-muted-foreground">{"Temps de livraison"}</p>
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
