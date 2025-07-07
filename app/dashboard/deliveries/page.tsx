"use client";

import PageLayout from "@/components/page-layout";
import Loading from "@/components/setup/loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/providers/datastore";
import AgentQuery from "@/queries/agent";
import DeliveryQuery from "@/queries/delivery";
import ZoneQuery from "@/queries/zone";
import { Agent, Delivery, Zone } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import {
  Clock,
  Edit,
  MapPin,
  Navigation,
  Package,
  Phone,
  Plus,
  Search,
  Trash2,
  Truck,
  User,
} from "lucide-react";
import React, { useState } from "react";

export default function DeliveriesPage() {
  const deliveriesQuery = new DeliveryQuery();
  const deliveryData = useQuery({
    queryKey: ["deliveryData"],
    queryFn: deliveriesQuery.getAll,
  });

  const agentQuery = new AgentQuery();
  const agentData = useQuery({
    queryKey: ["agentData"],
    queryFn: agentQuery.getAll,
  });

  const zoneQuery = new ZoneQuery();
  const zoneData = useQuery({
    queryKey: ["zoneData"],
    queryFn: zoneQuery.getAll,
  });

  const { setLoading } = useStore();

  const [selectedDelivery, setSelectedDelivery] = useState<Delivery>();
  const [drivers, setDrivers] = useState<Agent[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("deliveries");

  const [selectedDriver, setSelectedDriver] = useState<Agent | null>(null);
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [isEditDriverOpen, setIsEditDriverOpen] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: "",
    phone: "",
    zone: "",
    email: "",
    address: "",
    vehicleType: "Moto",
    licenseNumber: "",
  });

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
    agentData.data,
    agentData.isLoading,
    agentData.isLoading,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Livré":
        return "default";
      case "En cours":
        return "secondary";
      case "En route":
        return "outline";
      case "En attente":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "destructive";
      case "Normal":
        return "outline";
      default:
        return "outline";
    }
  };

  const getDriverStatusColor = (status: string) => {
    switch (status) {
      case "Disponible":
        return "default";
      case "En livraison":
        return "secondary";
      case "En route":
        return "outline";
      case "Pause":
        return "destructive";
      default:
        return "outline";
    }
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
      {deliveryData.isSuccess && agentData.isSuccess && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {"En cours"}
              </CardTitle>
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
              <div className="text-2xl font-bold">
                {todayDeliveries}
              </div>
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
              <p className="text-xs text-muted-foreground">
                Temps de livraison
              </p>
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
                  agentData.data.filter(
                    (x) => x.status === "AVAILABLE" || x.status === "FULL"
                  ).length
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Sur {agentData.data.length} disponibles
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "deliveries" ? (
        <>
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
          {deliveryData.isLoading ? (
            <Loading status={"loading"} />
          ) : deliveryData.isError ? (
            <Loading status={"failed"} />
          ) : deliveryData.isSuccess ? (
            <Card>
              <CardHeader>
                <CardTitle>{`Livraisons (${filteredDeliveries.length})`}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{"Référence"}</TableHead>
                      <TableHead>{"Client"}</TableHead>
                      <TableHead>{"Zone"}</TableHead>
                      <TableHead>{"Livreur"}</TableHead>
                      <TableHead>{"Statut"}</TableHead>
                      <TableHead>{"Priorité"}</TableHead>
                      <TableHead>{"Heure prévue"}</TableHead>
                      <TableHead>{"Actions"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDeliveries.map((delivery) => (
                      <TableRow key={delivery.id}>
                        <TableCell>
                          <div>
                            <p className="text-xs">
                              {delivery.trackingCode}
                            </p>
                          </div>
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
                          {
                            delivery.agent?.user?.name ?? "Non renseigné"
                          }
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
                              {new Date(
                                delivery.scheduledTime
                              ).toLocaleDateString()}
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
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedDelivery(delivery)}
                              >
                                Détails
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>
                                  Détails de la livraison {selectedDelivery?.id}
                                </DialogTitle>
                                <DialogDescription>
                                  Informations complètes sur la livraison
                                </DialogDescription>
                              </DialogHeader>

                              <div className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <h4 className="font-medium mb-2 flex items-center gap-2">
                                      <Package className="h-4 w-4" />
                                      Informations commande
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span>Commande:</span>
                                        <span className="font-medium">
                                          {selectedDelivery?.orderId}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Code suivi:</span>
                                        <span className="font-mono">
                                          {selectedDelivery?.trackingCode}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Poids:</span>
                                        <span>
                                          {selectedDelivery?.order?.weight}kg
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Articles:</span>
                                        <span>
                                          {
                                            selectedDelivery?.order?.orderItems
                                              ?.length
                                          }{" "}
                                          produits
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-medium mb-2 flex items-center gap-2">
                                      <MapPin className="h-4 w-4" />
                                      Adresse de livraison
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                      <div>
                                        <p className="font-medium">
                                          {selectedDelivery?.order?.user.name}
                                        </p>
                                        <p>
                                          {
                                            selectedDelivery?.order?.address
                                              ?.local
                                          }
                                        </p>
                                        <p className="text-muted-foreground">
                                          {
                                            selectedDelivery?.order?.address
                                              ?.zone?.name
                                          }
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {selectedDelivery?.agent && (
                                  <div className="border-t pt-4">
                                    <h4 className="font-medium mb-2 flex items-center gap-2">
                                      <User className="h-4 w-4" />
                                      Livreur assigné
                                    </h4>
                                    <div className="flex items-center gap-3">
                                      <Avatar className="h-10 w-10">
                                        <AvatarImage
                                          src={
                                            selectedDelivery?.agent.user
                                              ?.imageUrl || "/placeholder.png"
                                          }
                                        />
                                        <AvatarFallback>
                                          {selectedDelivery?.agent.user?.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="font-medium">
                                          {selectedDelivery?.agent.user?.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          {selectedDelivery?.agent.user?.tel}
                                        </p>
                                        <div className="flex items-center gap-1 mt-1">
                                          <span className="text-xs">
                                            Note: {selectedDelivery?.agent.code}
                                            /5
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                <div className="border-t pt-4">
                                  <h4 className="font-medium mb-2 flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Horaires
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span>Heure prévue:</span>
                                      <span>
                                        {new Date(
                                          selectedDelivery
                                            ? selectedDelivery.scheduledTime
                                            : ""
                                        ).toLocaleString()}
                                      </span>
                                    </div>
                                    {selectedDelivery?.estimatedArrival && (
                                      <div className="flex justify-between">
                                        <span>Arrivée estimée:</span>
                                        <span>
                                          {new Date(
                                            selectedDelivery.estimatedArrival
                                          ).toLocaleString()}
                                        </span>
                                      </div>
                                    )}
                                    {selectedDelivery?.deliveredTime && (
                                      <div className="flex justify-between">
                                        <span>Livré à:</span>
                                        <span className="text-green-600">
                                          {new Date(
                                            selectedDelivery.deliveredTime ?? ""
                                          )?.toLocaleString()}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <Button>
                                    <Navigation className="mr-2 h-4 w-4" />
                                    Suivre en temps réel
                                  </Button>
                                  <Button variant="outline">
                                    <Phone className="mr-2 h-4 w-4" />
                                    Contacter livreur
                                  </Button>
                                  {!selectedDelivery?.agent && (
                                    <Button variant="outline">
                                      Assigner livreur
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
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
        </>
      ) : (
        /* Drivers Tab */
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Équipe de livraison</CardTitle>
            <Button onClick={() => setIsAddDriverOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un livreur
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {drivers.map((driver) => (
                <Card key={driver.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={driver.user?.imageUrl || "/placeholder.svg"}
                        />
                        <AvatarFallback>
                          {driver.user?.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{driver.user?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {driver.user?.tel}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedDriver(driver);
                            setIsEditDriverOpen(true);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Zone:</span>
                        <span>{driver.zone.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Statut:</span>
                        <Badge variant={getDriverStatusColor(driver.status)}>
                          {driver.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>En cours:</span>
                        <span>
                          {
                            driver.delivery?.filter(
                              (x) =>
                                x.status !== "COMPLETED" &&
                                x.status !== "CANCELED"
                            ).length
                          }{" "}
                          livraisons
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Aujourd'hui:</span>
                        <span>
                          {
                            driver.delivery?.filter((x) => {
                              const today = new Date();
                              const deliveryDate = new Date(x.scheduledTime);
                              return (
                                deliveryDate.getFullYear() ===
                                  today.getFullYear() &&
                                deliveryDate.getMonth() === today.getMonth() &&
                                deliveryDate.getDate() === today.getDate()
                              );
                            }).length
                          }
                          livrées
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Note:</span>
                        <span>{driver.code}/5 ⭐</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Phone className="mr-1 h-3 w-3" />
                        Appeler
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Assigner
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog Ajouter Livreur */}
      <Dialog open={isAddDriverOpen} onOpenChange={setIsAddDriverOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau livreur</DialogTitle>
            <DialogDescription>
              Remplissez les informations du nouveau livreur
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                value={newDriver.name}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, name: e.target.value })
                }
                placeholder="Ex: Ibrahima Sarr"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={newDriver.phone}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, phone: e.target.value })
                }
                placeholder="Ex: +221 77 123 45 67"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newDriver.email}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, email: e.target.value })
                }
                placeholder="Ex: ibrahima@oumoul.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="zone">Zone de couverture</Label>
              <Select
                value={newDriver.zone}
                onValueChange={(value) =>
                  setNewDriver({ ...newDriver, zone: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dakar Plateau">Dakar Plateau</SelectItem>
                  <SelectItem value="Parcelles Assainies">
                    Parcelles Assainies
                  </SelectItem>
                  <SelectItem value="Almadies">Almadies</SelectItem>
                  <SelectItem value="Yoff">Yoff</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vehicle">Type de véhicule</Label>
              <Select
                value={newDriver.vehicleType}
                onValueChange={(value) =>
                  setNewDriver({ ...newDriver, vehicleType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Moto">Moto</SelectItem>
                  <SelectItem value="Voiture">Voiture</SelectItem>
                  <SelectItem value="Camionnette">Camionnette</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="license">Numéro de permis</Label>
              <Input
                id="license"
                value={newDriver.licenseNumber}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, licenseNumber: e.target.value })
                }
                placeholder="Ex: A123456789"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Adresse</Label>
              <Textarea
                id="address"
                value={newDriver.address}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, address: e.target.value })
                }
                placeholder="Adresse complète du livreur"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsAddDriverOpen(false)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={() => setIsAddDriverOpen(false)}
              className="flex-1"
            >
              Ajouter le livreur
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Modifier Livreur */}
      <Dialog open={isEditDriverOpen} onOpenChange={setIsEditDriverOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier le livreur</DialogTitle>
            <DialogDescription>
              Modifiez les informations du livreur
            </DialogDescription>
          </DialogHeader>
          {selectedDriver && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nom complet</Label>
                <Input
                  id="edit-name"
                  defaultValue={selectedDriver.user?.name}
                  placeholder="Ex: Ibrahima Sarr"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Téléphone</Label>
                <Input
                  id="edit-phone"
                  defaultValue={selectedDriver.user?.tel ?? undefined}
                  placeholder="Ex: +221 77 123 45 67"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-zone">Zone de couverture</Label>
                <Select defaultValue={selectedDriver.zone.name}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dakar Plateau">Dakar Plateau</SelectItem>
                    <SelectItem value="Parcelles Assainies">
                      Parcelles Assainies
                    </SelectItem>
                    <SelectItem value="Almadies">Almadies</SelectItem>
                    <SelectItem value="Yoff">Yoff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Statut</Label>
                <Select defaultValue={selectedDriver.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Disponible">Disponible</SelectItem>
                    <SelectItem value="En livraison">En livraison</SelectItem>
                    <SelectItem value="En route">En route</SelectItem>
                    <SelectItem value="Pause">Pause</SelectItem>
                    <SelectItem value="Indisponible">Indisponible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <div className="flex gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsEditDriverOpen(false)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={() => setIsEditDriverOpen(false)}
              className="flex-1"
            >
              Sauvegarder
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
