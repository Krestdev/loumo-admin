"use client";

import PageLayout from "@/components/page-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { filterByDate, findLatestByDate, XAF } from "@/lib/utils";
import { useStore } from "@/providers/datastore";
import OrderQuery from "@/queries/order";
import UserQuery from "@/queries/user";
import ZoneQuery from "@/queries/zone";
import { Order, User, Zone } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { formatRelative } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowDownAZ, ArrowUpAz, Search, Star, Users } from "lucide-react";
import React, { useState } from "react";
import BanClient from "./ban";
import ViewClient from "./view";

export default function ClientsPage() {
  const clientQuery = new UserQuery();
  const zoneQuery = new ZoneQuery();
  const orderQuery = new OrderQuery();
  const { setLoading } = useStore();
  const getUsers = useQuery({
    queryKey: ["clients"],
    queryFn: () => clientQuery.getAllClients(),
    refetchOnWindowFocus: false,
  });

  const getZones = useQuery({
    queryKey: ["zones"],
    queryFn: () => zoneQuery.getAll(),
    refetchOnWindowFocus: false,
  });

  const getOrders = useQuery({
    queryKey: ["orders"],
    queryFn: () => orderQuery.getAll(),
    refetchOnWindowFocus: false,
  });

  const [users, setUsers] = useState<User[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  React.useEffect(() => {
    setLoading(getUsers.isLoading || getZones.isLoading || getOrders.isLoading);
    if (getUsers.isSuccess) {
      setUsers(getUsers.data);
    }
    if (getZones.isSuccess) {
      setZones(getZones.data);
    }
    if (getOrders.isSuccess) {
      setOrders(getOrders.data);
    }
  }, [
    setLoading,
    getUsers.data,
    getUsers.isLoading,
    getUsers.isSuccess,
    getZones.data,
    getZones.isLoading,
    getZones.isSuccess,
    getOrders.data,
    getOrders.isLoading,
    getOrders.isSuccess,
    setUsers,
    setZones,
    setOrders,
  ]);

  const [selectedClient, setSelectedClient] = useState<User | undefined>();
  const [clientDialog, setClientDialog] = useState(false);
  const [banDialog, setBanDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [sortDirection, setSortDirection] = useState<string>();

  /**Pour filtrer les périodes */
  function isWithinPeriod(date: Date | string, period: string): boolean {
    const createdAt = new Date(date);
    const now = new Date();

    switch (period) {
      case "7days":
      case "30days":
      case "90days":
        const days = parseInt(period.replace("days", ""));
        const threshold = new Date();
        threshold.setDate(now.getDate() - days);
        return createdAt >= threshold;

      case "year":
        return createdAt.getFullYear() === now.getFullYear();

      case "all":
      default:
        return true;
    }
  }

  const filteredClients = React.useMemo(() => {
    return users.sort((a,b)=> sortDirection === "asc" ? a.name.localeCompare(b.name, "fr") : sortDirection === "desc" ? b.name.localeCompare(a.name, "fr") : 0).filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase());


      const matchesZone =
        zoneFilter === "all" ||
        client.addresses?.some((a) => a.zone?.name === zoneFilter);

      const matchesPeriod =
        periodFilter === "all" ||
        isWithinPeriod(client.createdAt, periodFilter);

      return matchesSearch && matchesZone && matchesPeriod;
    });
  }, [users, searchTerm, zoneFilter, periodFilter, sortDirection]);

  const handleView = (element: User) => {
    setSelectedClient(element);
    setClientDialog(true);
  };
  const handleBan = (element: User) => {
    setSelectedClient(element);
    setBanDialog(true);
  };
  const growth = () => {
    const current = filterByDate(users, 30).length;
    const diff = filterByDate(users, 60).length - current;
    if (diff > 0) {
      return `${(current * 100) / diff}% vs période précédente`;
    }
    if (current === 0) {
      return null;
    }
    return `+${current} vs période précédente`;
  };

  return (
    <PageLayout
      isLoading={getUsers.isLoading}
      className="flex-1 overflow-auto p-4 space-y-6"
    >
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
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">
                {filterByDate(users, 30).length}
              </span>{" "}
              {"ce mois"}
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
            <div className="text-2xl font-bold">
              {filterByDate(users, 30).length}
            </div>
            <p className="text-xs text-muted-foreground">{growth()}</p>
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
            <div className="text-2xl font-bold">
              {filterByDate(users, 7).length}
            </div>
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
            <div className="text-2xl font-bold">
              {users.reduce((sum, el) => sum + el.fidelity, 0)}
            </div>
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
            <div className="space-y-2 flex-1 min-w-[200px]">
              <label className="text-sm font-medium">{"Recherche"}</label>
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
            <Select value={sortDirection} onValueChange={setSortDirection}>
              <SelectTrigger className="w-32">
                {sortDirection === "asc" ? <ArrowDownAZ size={16}/> : <ArrowUpAz size={16}/>}
                <SelectValue placeholder="Arranger par ordre alphabétique"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">{"A-Z"}</SelectItem>
                <SelectItem value="desc">{"Z-A"}</SelectItem>
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
                <TableHead>{"Adresses"}</TableHead>
                <TableHead>{"Points fidélité"}</TableHead>
                <TableHead>{"Commandes"}</TableHead>
                <TableHead>{"Total dépensé"}</TableHead>
                <TableHead>{"Dernière commande"}</TableHead>
                <TableHead>{"Statut"}</TableHead>
                <TableHead>{"Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
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
                      <div className="grid gap-1">
                        {client.addresses &&
                          client.addresses.map((x) => (
                            <div key={x.id} className="text-xs grid">
                              <span className="font-semibold">
                                {zones.find((y) => y.id === x.zoneId)?.name}
                              </span>
                              <span className="text-muted-foreground">
                                {x.street}
                              </span>
                            </div>
                          ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        {client.fidelity}
                      </div>
                    </TableCell>
                    <TableCell>
                      {orders.filter((x) => x.userId === client.id).length}
                    </TableCell>
                    <TableCell>
                      {XAF.format(
                        orders
                          .filter((x) => x.userId === client.id)
                          .reduce((total, el) => total + el.total, 0)
                      )}
                    </TableCell>
                    <TableCell>
                      {findLatestByDate(
                        orders.filter((x) => x.userId === client.id),
                        "createdAt"
                      )?.createdAt
                        ? formatRelative(
                            new Date(
                              findLatestByDate(
                                orders.filter((x) => x.userId === client.id),
                                "createdAt"
                              )?.createdAt ?? "2025-01-01"
                            ), // ✅ date réelle
                            new Date(), // maintenant
                            { locale: fr }
                          )
                        : "--"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={client.verified ? "secondary" : "outline"}
                      >
                        {client.verified ? "Vérifié" : "Non vérifié"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant={"outline"}
                          onClick={() => handleView(client)}
                        >
                          {"Voir"}
                        </Button>
                        <Button
                          variant={client.active ? "delete" : "default"}
                          onClick={() => handleBan(client)}
                        >
                          {client.active ? "Bannir" : "Débannir"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-gray-500 space-y-2 py-5 sm:text-lg xl:text-xl"
                  >
                    {"Aucun client trouvé"}
                    <img
                      src={"/images/search.png"}
                      alt={"no-image"}
                      className="w-1/3 max-w-32 h-auto mx-auto mt-5 opacity-20"
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedClient && (
        <ViewClient
          client={selectedClient}
          openChange={setClientDialog}
          isOpen={clientDialog}
          orders={orders.filter((x) => x.userId === selectedClient.id)}
        />
      )}
      {selectedClient && (
        <BanClient
          client={selectedClient}
          openChange={setBanDialog}
          isOpen={banDialog}
        />
      )}
    </PageLayout>
  );
}
