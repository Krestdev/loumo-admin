"use client";

import { DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import OrderQuery from "@/queries/order";
import { Order, Zone } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle,
  CreditCard,
  Download,
  Eye,
  Filter,
  MapPin,
  Package,
  Search,
  User,
  UserPlus,
} from "lucide-react";
import React, { useState } from "react";
import PageLayout from "@/components/page-layout";
import { XAF } from "@/lib/utils";
import ZoneQuery from "@/queries/zone";
import { useStore } from "@/providers/datastore";
import ViewOrder from "./view";

export default function OrdersPage() {
  const ordersQuery = new OrderQuery();
  const zoneQuery = new ZoneQuery();
  const orderData = useQuery({
    queryKey: ["orderData"],
    queryFn: ordersQuery.getAll,
    refetchOnWindowFocus: false
  });

  const getZones = useQuery({
    queryKey: ["zones"],
    queryFn: () => zoneQuery.getAll(),
    refetchOnWindowFocus: false
  })

  const [orders, setOrders] = useState<Order[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const { setLoading } = useStore();

  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [amountFilter, setAmountFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [viewDialog, setViewDialog] = useState(false);

  const [isAssignDriverOpen, setIsAssignDriverOpen] = useState(false);
  const [selectedOrderForAssign, setSelectedOrderForAssign] =
    useState<Order | null>(null);

    React.useEffect(()=>{
      setLoading(orderData.isLoading || getZones.isLoading);
      if(orderData.isSuccess){
        setOrders(orderData.data);
      }
      if(getZones.isSuccess){
        setZones(getZones.data);
      }
    },[setLoading, setZones, setOrders, getZones.data, getZones.isLoading, getZones.isSuccess, orderData.data, orderData.isLoading, orderData.isSuccess])

  const availableDrivers = [
    {
      id: 1,
      name: "Ibrahima Sarr",
      zone: "Dakar Plateau",
      status: "Disponible",
    },
    {
      id: 2,
      name: "Moussa Diallo",
      zone: "Parcelles Assainies",
      status: "Disponible",
    },
    { id: 3, name: "Abdou Kane", zone: "Yoff", status: "Disponible" },
    { id: 4, name: "Fatou Mbaye", zone: "Almadies", status: "Disponible" },
  ];

    const filteredOrders = orders.filter((order) => {
      const matchesSearch =
        order.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id === parseInt(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    const handleView = (order:Order) =>{
      setSelectedOrder(order);
      setViewDialog(true);
    }


  return (
    <PageLayout isLoading={orderData.isLoading || getZones.isLoading} className="flex-1 overflow-auto p-4 space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>{"Filtres"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par client ou numéro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut commande" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Préparation">Préparation</SelectItem>
                  <SelectItem value="En livraison">En livraison</SelectItem>
                  <SelectItem value="Livré">Livré</SelectItem>
                  <SelectItem value="Annulé">Annulé</SelectItem>
                </SelectContent>
              </Select>

              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut paiement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les paiements</SelectItem>
                  <SelectItem value="Payé">Payé</SelectItem>
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="Échoué">Échoué</SelectItem>
                  <SelectItem value="Remboursé">Remboursé</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les dates</SelectItem>
                  <SelectItem value="today">Aujourd'hui</SelectItem>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="quarter">Ce trimestre</SelectItem>
                </SelectContent>
              </Select>

              <Select value={zoneFilter} onValueChange={setZoneFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Zone de livraison" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les zones</SelectItem>
                  <SelectItem value="Dakar Plateau">Dakar Plateau</SelectItem>
                  <SelectItem value="Parcelles Assainies">
                    Parcelles Assainies
                  </SelectItem>
                  <SelectItem value="Almadies">Almadies</SelectItem>
                  <SelectItem value="Yoff">Yoff</SelectItem>
                </SelectContent>
              </Select>

              <Select value={amountFilter} onValueChange={setAmountFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Montant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les montants</SelectItem>
                  <SelectItem value="0-50">0€ - 50€</SelectItem>
                  <SelectItem value="50-100">50€ - 100€</SelectItem>
                  <SelectItem value="100-200">100€ - 200€</SelectItem>
                  <SelectItem value="200+">200€+</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtres avancés
              </Button>

              <Button variant="outline">Exporter</Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        { orderData.isSuccess && (
          <Card>
            <CardHeader>
              <CardTitle>Commandes ({filteredOrders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{"Ref"}</TableHead>
                    <TableHead>{"Client"}</TableHead>
                    <TableHead>{"Zone"}</TableHead>
                    <TableHead>{"Montant"}</TableHead>
                    <TableHead>{"Poids"}</TableHead>
                    <TableHead>{"Statut"}</TableHead>
                    <TableHead>{"Paiement"}</TableHead>
                    <TableHead>{"Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.user.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{order.address && 
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{zones.find(x=>x.id === order.address?.id)?.name}</span>
                          <span className="text-xs text-muted-foreground">{order.address.street}</span>
                        </div>
                        }</TableCell>
                      <TableCell className="font-semibold">{XAF.format(order.total)}</TableCell>
                      <TableCell>{`${order.weight} kg`}</TableCell>
                      <TableCell>
                        <Badge variant={order.status === "ACCEPTED" ? "default" : order.status === "REJECTED" ? "destructive" : order.status === "PENDING" ? "secondary" : order.status === "COMPLETED" ? "default" : "outline" }>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={order.payment ? "outline" : "destructive"}>
                          {order.payment ? "Payé" : "Non Payé"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant={"outline"} size={"icon"} onClick={()=>{handleView(order)}}>
                            <Eye size={16}/>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setSelectedOrderForAssign(order);
                              setIsAssignDriverOpen(true);
                            }}
                          >
                            <UserPlus size={16} />
                          </Button>

                          {order.status !== "COMPLETED" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Marquer comme livré
                                console.log("Marquer comme livré:", order.id);
                              }}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

      {/* Dialog Assigner Livreur */}
      <Dialog open={isAssignDriverOpen} onOpenChange={setIsAssignDriverOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assigner un livreur</DialogTitle>
            <DialogDescription>
              Sélectionnez un livreur pour la commande{" "}
              {selectedOrderForAssign?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedOrderForAssign && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">Détails de la commande</p>
                <p className="text-sm text-muted-foreground">
                  Client: {selectedOrderForAssign.user?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Zone: {selectedOrderForAssign.address?.zone?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Poids: {selectedOrderForAssign.weight}kg
                </p>
              </div>

              <div className="space-y-2">
                <Label>Livreurs disponibles</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableDrivers
                    .filter(
                      (driver) =>
                        driver.zone ===
                          selectedOrderForAssign.address?.zone?.name ||
                        driver.status === "Disponible"
                    )
                    .map((driver) => (
                      <div
                        key={driver.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted cursor-pointer"
                        onClick={() => {
                          console.log(
                            "Assigner livreur:",
                            driver.name,
                            "à commande:",
                            selectedOrderForAssign.id
                          );
                          setIsAssignDriverOpen(false);
                        }}
                      >
                        <div>
                          <p className="font-medium">{driver.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {driver.zone}
                          </p>
                        </div>
                        <Badge variant="outline">{driver.status}</Badge>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsAssignDriverOpen(false)}
              className="flex-1"
            >
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      { selectedOrder && <ViewOrder order={selectedOrder} openChange={setViewDialog} isOpen={viewDialog} zones={zones}/> }
    </PageLayout>
  );
}
