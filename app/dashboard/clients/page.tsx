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
import { User } from "@/types/types";
import UserQuery from "@/queries/user";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/setup/loading";

const recentOrders = [
  { id: "#ORD-001", date: "2024-01-15", amount: 45.8, status: "Livré" },
  { id: "#ORD-002", date: "2024-01-10", amount: 78.2, status: "Livré" },
  { id: "#ORD-003", date: "2024-01-05", amount: 32.5, status: "Livré" },
  { id: "#ORD-004", date: "2023-12-28", amount: 91.3, status: "Livré" },
  { id: "#ORD-005", date: "2023-12-20", amount: 56.4, status: "Livré" },
];

export default function ClientsPage() {
  const userQuery = new UserQuery();
  const userData = useQuery({
    queryKey: ["userData"],
    queryFn: userQuery.getAll,
  });

  const [selectedClient, setSelectedClient] = useState<User | null>();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");

  let filteredClients: User[];
  if (userData.isSuccess) {
    filteredClients = userData.data.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase());
      // const matchesStatus =
      //   statusFilter === "all" || client.status === statusFilter;
      const matchesZone =
        zoneFilter === "all" || client.addresses?.[0].zone?.name === zoneFilter;
      // return matchesSearch && matchesStatus && matchesZone;
      return matchesSearch && matchesZone;
    });
  } else {
    filteredClients = [];
  }

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
      {userData.isSuccess && (
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
                  <SelectItem value="Dakar Plateau">
                    {"Dakar Plateau"}
                  </SelectItem>
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
      )}

      {/* Clients Table */}
      {userData.isLoading ? (
        <Loading status={"loading"} />
      ) : userData.isError ? (
        <Loading status={"failed"} />
      ) : userData.isSuccess ? (
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
                            src={client.imageUrl || "/placeholder.svg"}
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
                    <TableCell>
                      {client.addresses && client.addresses.length > 0
                        ? client.addresses?.[0].zone?.name
                        : "no address"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        {client.fidelity}
                      </div>
                    </TableCell>
                    <TableCell>{client.orders?.length}</TableCell>
                    <TableCell>
                      €
                      {client.orders
                        ?.reduce((sum, odr) => sum + (odr.total ?? 0), 0)
                        .toFixed(2)}
                    </TableCell>
                    <TableCell>{client.orders?.pop()?.createdAt}</TableCell>
                    <TableCell>
                      {/* <Badge variant={getStatusColor(client.status)}>
                      {client.status}
                    </Badge> */}
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
                            <DialogTitle>{`Profil client - ${selectedClient?.name}`}</DialogTitle>
                            <DialogDescription>
                              {
                                "Informations détaillées et historique du client"
                              }
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
                                        selectedClient?.imageUrl ||
                                        "/placeholder.svg"
                                      }
                                    />
                                    <AvatarFallback>
                                      {selectedClient?.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-lg">
                                      {selectedClient?.name}
                                    </p>
                                    {/* <Badge
                                    variant={getStatusColor(
                                      selectedClient?.status
                                    )}
                                  >
                                    {selectedClient?.status}
                                  </Badge> */}
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{selectedClient?.email}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{selectedClient?.tel}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                      {
                                        selectedClient?.addresses?.[0].zone
                                          ?.name
                                      }
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                      {"Client depuis le"}{" "}
                                      {new Date(
                                        selectedClient
                                          ? selectedClient.createdAt
                                          : "now"
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                <div className="pt-2 border-t">
                                  <p className="text-sm text-muted-foreground">
                                    {"Adresse complète:"}
                                  </p>
                                  <p>{selectedClient?.addresses?.[0].local}</p>
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
                                      {selectedClient?.orders?.length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {"Commandes"}
                                    </div>
                                  </div>
                                  <div className="text-center p-3 bg-muted rounded-lg">
                                    <div className="text-2xl font-bold">
                                      €
                                      {selectedClient?.orders
                                        ?.reduce(
                                          (sum, odr) => sum + (odr.total ?? 0),
                                          0
                                        )
                                        .toFixed(2)}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {"Total dépensé"}
                                    </div>
                                  </div>
                                  <div className="text-center p-3 bg-muted rounded-lg">
                                    <div className="text-2xl font-bold flex items-center justify-center gap-1">
                                      <Star className="h-4 w-4 text-yellow-500" />
                                      {selectedClient?.fidelity}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {"Points fidélité"}
                                    </div>
                                  </div>
                                  <div className="text-center p-3 bg-muted rounded-lg">
                                    <div className="text-2xl font-bold">
                                      €
                                      {(
                                        selectedClient?.orders?.reduce(
                                          (sum, odr) => sum + (odr.total ?? 0),
                                          0
                                        ) ??
                                        0 /
                                          (selectedClient?.orders
                                            ? selectedClient?.orders.length
                                            : 0)
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
                                    {selectedClient?.orders?.pop()?.createdAt}
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
      ) : (
        <Loading />
      )}
    </main>
  );
}
