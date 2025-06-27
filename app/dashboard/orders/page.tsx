"use client";

import { DialogTrigger } from "@/components/ui/dialog";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Eye,
  Download,
  MapPin,
  User,
  Package,
  CreditCard,
} from "lucide-react";
import { UserPlus, CheckCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Order } from "@/types/types";
import OrderQuery from "@/queries/order";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/setup/loading";

export default function OrdersPage() {
  const ordersQuery = new OrderQuery();
  const orderData = useQuery({
    queryKey: ["orderData"],
    queryFn: ordersQuery.getAll,
  });

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [amountFilter, setAmountFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const [isAssignDriverOpen, setIsAssignDriverOpen] = useState(false);
  const [selectedOrderForAssign, setSelectedOrderForAssign] =
    useState<Order | null>(null);

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

  let filteredOrders: Order[];
  if (orderData.isSuccess) {
    filteredOrders = orderData.data.filter((order) => {
      const matchesSearch =
        order.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id === parseInt(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    console.log(filteredOrders, orderData.data);
  } else {
    filteredOrders = [];
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Livré":
        return "default";
      case "En livraison":
        return "secondary";
      case "En cours":
        return "outline";
      case "Préparation":
        return "outline";
      default:
        return "destructive";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Payé":
        return "default";
      case "En attente":
        return "secondary";
      default:
        return "destructive";
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <main className="flex-1 overflow-auto p-4 space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtres</CardTitle>
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
        {orderData.isLoading ? (
          <Loading status={"loading"} />
        ) : orderData.isError ? (
          <Loading status={"failed"} />
        ) : orderData.isSuccess ? (
          <Card>
            <CardHeader>
              <CardTitle>Commandes ({filteredOrders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Commande</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Poids</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Paiement</TableHead>
                    <TableHead>Actions</TableHead>
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
                      <TableCell>{order.address?.zone?.name}</TableCell>
                      <TableCell>€{order.payment?.total.toFixed(2)}</TableCell>
                      <TableCell>{order.weight}kg</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPaymentStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>
                                  Détails de la commande {selectedOrder?.id}
                                </DialogTitle>
                                <DialogDescription>
                                  Informations complètes sur la commande
                                </DialogDescription>
                              </DialogHeader>

                              <div className="grid gap-6 md:grid-cols-2">
                                {/* Customer Info */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <User className="h-4 w-4" />
                                      Informations client
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-2">
                                    <p>
                                      <strong>Nom:</strong>{" "}
                                      {selectedOrder?.user?.name}
                                    </p>
                                    <p>
                                      <strong>Email:</strong>{" "}
                                      {selectedOrder?.user.email}
                                    </p>
                                    <p>
                                      <strong>Téléphone:</strong>{" "}
                                      {selectedOrder?.user.tel}
                                    </p>
                                  </CardContent>
                                </Card>

                                {/* Delivery Info */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4" />
                                      Livraison
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-2">
                                    <p>
                                      <strong>Zone:</strong>{" "}
                                      {selectedOrder?.address?.zone?.name}
                                    </p>
                                    <p>
                                      <strong>Adresse:</strong>{" "}
                                      {selectedOrder?.address?.local}
                                    </p>
                                    {/* <p>
                                    <strong>Date prévue:</strong> {selectedOrder?.deliveryDate}
                                  </p> */}
                                    {/* <p>
                                    <strong>Frais de livraison:</strong> €{selectedOrder?.deliveryFee.toFixed(2)}
                                  </p> */}
                                  </CardContent>
                                </Card>

                                {/* Order Items */}
                                <Card className="md:col-span-2">
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <Package className="h-4 w-4" />
                                      Produits commandés
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Produit</TableHead>
                                          <TableHead>Quantité</TableHead>
                                          <TableHead>Prix unitaire</TableHead>
                                          <TableHead>Total</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {selectedOrder?.orderItems?.map(
                                          (item, index) => (
                                            <TableRow key={index}>
                                              <TableCell>
                                                {item.productVariant?.name}
                                              </TableCell>
                                              <TableCell>
                                                {item.quantity}
                                              </TableCell>
                                              <TableCell>
                                                €
                                                {item.productVariant?.price.toFixed(
                                                  2
                                                )}
                                              </TableCell>
                                              <TableCell>
                                                €
                                                {(
                                                  item.quantity *
                                                  (item.productVariant
                                                    ? item.productVariant.price
                                                    : 1)
                                                ).toFixed(2)}
                                              </TableCell>
                                            </TableRow>
                                          )
                                        )}
                                      </TableBody>
                                    </Table>
                                    <div className="mt-4 space-y-2 border-t pt-4">
                                      <div className="flex justify-between">
                                        <span>Sous-total:</span>
                                        <span>
                                          € 25
                                          {/* {(
                                            selectedOrder?.total -
                                            selectedOrder?.deliveryFee
                                          ).toFixed(2)} */}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Frais de livraison:</span>
                                        <span>
                                          €
                                          {selectedOrder?.deliveryFee.toFixed(
                                            2
                                          )}
                                        </span>
                                      </div>
                                      <div className="flex justify-between font-bold">
                                        <span>Total:</span>
                                        <span>
                                          €{selectedOrder?.total.toFixed(2)}
                                        </span>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Payment Info */}
                                <Card className="md:col-span-2">
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <CreditCard className="h-4 w-4" />
                                      Informations de paiement
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="flex justify-between items-center">
                                    <div>
                                      <p>
                                        <strong>Statut:</strong>{" "}
                                        {selectedOrder?.status}
                                      </p>
                                      <p>
                                        <strong>Montant:</strong> €
                                        {selectedOrder?.total.toFixed(2)}
                                      </p>
                                      <p>
                                        <strong>Date de commande:</strong>{" "}
                                        {new Date(
                                          selectedOrder
                                            ? selectedOrder.createdAt
                                            : "now"
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <Button>
                                      <Download className="mr-2 h-4 w-4" />
                                      Télécharger facture
                                    </Button>
                                  </CardContent>
                                </Card>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedOrderForAssign(order);
                              setIsAssignDriverOpen(true);
                            }}
                          >
                            <UserPlus className="h-4 w-4" />
                          </Button>

                          {order.status !== "Livré" && (
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
        ) : (
          <Loading />
        )}
      </main>

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
    </div>
  );
}
