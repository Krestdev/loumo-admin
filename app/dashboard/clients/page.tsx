"use client";

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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Users,
  Star,
  ShoppingCart,
  MapPin,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const clients = [
  {
    id: 1,
    name: "Marie Dubois",
    email: "marie.dubois@email.com",
    phone: "+221 77 123 45 67",
    zone: "Dakar Plateau",
    address: "Rue 15, Immeuble Salam, Apt 3B",
    loyaltyPoints: 2450,
    totalOrders: 23,
    totalSpent: 1280.5,
    lastOrder: "2024-01-15",
    status: "Fidèle",
    joinDate: "2023-03-15",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 2,
    name: "Amadou Ba",
    email: "amadou.ba@email.com",
    phone: "+221 76 987 65 43",
    zone: "Parcelles Assainies",
    address: "Villa 123, Cité Millionnaire",
    loyaltyPoints: 1890,
    totalOrders: 18,
    totalSpent: 945.2,
    lastOrder: "2024-01-14",
    status: "Fidèle",
    joinDate: "2023-05-22",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 3,
    name: "Fatou Sall",
    email: "fatou.sall@email.com",
    phone: "+221 78 456 78 90",
    zone: "Almadies",
    address: "Résidence Les Palmiers, Villa 45",
    loyaltyPoints: 650,
    totalOrders: 8,
    totalSpent: 320.8,
    lastOrder: "2024-01-12",
    status: "Nouveau",
    joinDate: "2023-11-10",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 4,
    name: "Ousmane Diop",
    email: "ousmane.diop@email.com",
    phone: "+221 77 654 32 10",
    zone: "Yoff",
    address: "Quartier Résidentiel, Maison 67",
    loyaltyPoints: 3200,
    totalOrders: 35,
    totalSpent: 1850.75,
    lastOrder: "2024-01-13",
    status: "Fidèle",
    joinDate: "2022-12-05",
    avatar: "/placeholder-user.jpg",
  },
];

const recentOrders = [
  { id: "#ORD-001", date: "2024-01-15", amount: 45.8, status: "Livré" },
  { id: "#ORD-002", date: "2024-01-10", amount: 78.2, status: "Livré" },
  { id: "#ORD-003", date: "2024-01-05", amount: 32.5, status: "Livré" },
  { id: "#ORD-004", date: "2023-12-28", amount: 91.3, status: "Livré" },
  { id: "#ORD-005", date: "2023-12-20", amount: 56.4, status: "Livré" },
];

export default function ClientsPage() {
  const [selectedClient, setSelectedClient] = useState(clients[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || client.status === statusFilter;
    const matchesZone = zoneFilter === "all" || client.zone === zoneFilter;
    return matchesSearch && matchesStatus && matchesZone;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Fidèle":
        return "secondary";
      case "Nouveau":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <main className="flex-1 overflow-auto p-4 space-y-6">
      {/* Client Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Total clients"}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{"2,847"}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{"+12%"}</span> {"ce mois"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Nouveaux clients (30j)"}
            </CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{"89"}</div>
            <p className="text-xs text-muted-foreground">
              {"+12% vs période précédente"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Nouveaux clients"}
            </CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{"89"}</div>
            <p className="text-xs text-muted-foreground">{"Cette semaine"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Points fidélité"}
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{"45,280"}</div>
            <p className="text-xs text-muted-foreground">
              {"Points distribués"}
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
                  placeholder="Rechercher par nom ou email..."
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
                <SelectItem value="all">{"Tous"}</SelectItem>
                <SelectItem value="Fidèle">{"Fidèle"}</SelectItem>
                <SelectItem value="Nouveau">{"Nouveau"}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={zoneFilter} onValueChange={setZoneFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{"Toutes les zones"}</SelectItem>
                <SelectItem value="Dakar Plateau">{"Dakar Plateau"}</SelectItem>
                <SelectItem value="Parcelles Assainies">
                  {"Parcelles Assainies"}
                </SelectItem>
                <SelectItem value="Almadies">{"Almadies"}</SelectItem>
                <SelectItem value="Yoff">{"Yoff"}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{"Toute la période"}</SelectItem>
                <SelectItem value="7days">{"7 derniers jours"}</SelectItem>
                <SelectItem value="30days">{"30 derniers jours"}</SelectItem>
                <SelectItem value="90days">{"90 derniers jours"}</SelectItem>
                <SelectItem value="year">{"Cette année"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>{`Clients (${filteredClients.length})`}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{"Client"}</TableHead>
                <TableHead>{"Zone"}</TableHead>
                <TableHead>{"Points fidélité"}</TableHead>
                <TableHead>{"Commandes"}</TableHead>
                <TableHead>{"Total dépensé"}</TableHead>
                <TableHead>{"Dernière commande"}</TableHead>
                <TableHead>{"Statut"}</TableHead>
                <TableHead>{"Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={client.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback>
                          {client.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {client.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{client.zone}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      {client.loyaltyPoints.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>{client.totalOrders}</TableCell>
                  <TableCell>€{client.totalSpent.toFixed(2)}</TableCell>
                  <TableCell>{client.lastOrder}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(client.status)}>
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedClient(client)}
                        >
                          {"Voir détails"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{`Profil client - ${selectedClient.name}`}</DialogTitle>
                          <DialogDescription>
                            {"Informations détaillées et historique du client"}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-6 md:grid-cols-2">
                          {/* Client Info */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                {"Informations personnelles"}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage
                                    src={
                                      selectedClient.avatar ||
                                      "/placeholder.svg"
                                    }
                                  />
                                  <AvatarFallback>
                                    {selectedClient.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-lg">
                                    {selectedClient.name}
                                  </p>
                                  <Badge
                                    variant={getStatusColor(
                                      selectedClient.status
                                    )}
                                  >
                                    {selectedClient.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <span>{selectedClient.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span>{selectedClient.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span>{selectedClient.zone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span>
                                    {"Client depuis le"}{" "}
                                    {selectedClient.joinDate}
                                  </span>
                                </div>
                              </div>
                              <div className="pt-2 border-t">
                                <p className="text-sm text-muted-foreground">
                                  {"Adresse complète:"}
                                </p>
                                <p>{selectedClient.address}</p>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Stats */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <ShoppingCart className="h-4 w-4" />
                                {"Statistiques"}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-muted rounded-lg">
                                  <div className="text-2xl font-bold">
                                    {selectedClient.totalOrders}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {"Commandes"}
                                  </div>
                                </div>
                                <div className="text-center p-3 bg-muted rounded-lg">
                                  <div className="text-2xl font-bold">
                                    €{selectedClient.totalSpent.toFixed(0)}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {"Total dépensé"}
                                  </div>
                                </div>
                                <div className="text-center p-3 bg-muted rounded-lg">
                                  <div className="text-2xl font-bold flex items-center justify-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-500" />
                                    {selectedClient.loyaltyPoints.toLocaleString()}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {"Points fidélité"}
                                  </div>
                                </div>
                                <div className="text-center p-3 bg-muted rounded-lg">
                                  <div className="text-2xl font-bold">
                                    €
                                    {(
                                      selectedClient.totalSpent /
                                      selectedClient.totalOrders
                                    ).toFixed(0)}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {"Panier moyen"}
                                  </div>
                                </div>
                              </div>
                              <div className="pt-2 border-t">
                                <p className="text-sm text-muted-foreground">
                                  {"Dernière commande:"}
                                </p>
                                <p className="font-medium">
                                  {selectedClient.lastOrder}
                                </p>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Order History */}
                          <Card className="md:col-span-2">
                            <CardHeader>
                              <CardTitle>
                                {"Historique des commandes"}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>{"Commande"}</TableHead>
                                    <TableHead>{"Date"}</TableHead>
                                    <TableHead>{"Montant"}</TableHead>
                                    <TableHead>{"Statut"}</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {recentOrders.map((order) => (
                                    <TableRow key={order.id}>
                                      <TableCell className="font-medium">
                                        {order.id}
                                      </TableCell>
                                      <TableCell>{order.date}</TableCell>
                                      <TableCell>
                                        €{order.amount.toFixed(2)}
                                      </TableCell>
                                      <TableCell>
                                        <Badge variant="default">
                                          {order.status}
                                        </Badge>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </CardContent>
                          </Card>
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
    </main>
  );
}
