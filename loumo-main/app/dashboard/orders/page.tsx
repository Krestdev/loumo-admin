"use client";

import PageLayout from "@/components/page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  getOrderStatusLabel,
  paymentStatusMap,
  statusMap,
  XAF,
} from "@/lib/utils";
import { useStore } from "@/providers/datastore";
import DeliveryQuery from "@/queries/delivery";
import OrderQuery from "@/queries/order";
import ZoneQuery from "@/queries/zone";
import { Delivery, Order, Zone } from "@/types/types";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircleIcon,
  Eye,
  Loader,
  MoreHorizontal,
  Search,
  SquareChevronRight
} from "lucide-react";
import React, { useState } from "react";
import AssignDriver from "./assign";
import EndOrder from "./end";
import { OrdersPDFDocument } from "./pdf";
import ViewOrder from "./view";

export default function OrdersPage() {
  const ordersQuery = new OrderQuery();
  const zoneQuery = new ZoneQuery();
  const orderData = useQuery({
    queryKey: ["orders"],
    queryFn: ordersQuery.getAll,
    refetchOnWindowFocus: false,
  });

  const getZones = useQuery({
    queryKey: ["zones"],
    queryFn: () => zoneQuery.getAll(),
    refetchOnWindowFocus: false,
  });

  const deliveryQuery = new DeliveryQuery();
  const getDeliveries = useQuery({
    queryKey: ["deliveries"],
    queryFn: () => deliveryQuery.getAll(),
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const { setLoading } = useStore();

  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [amountFilter, setAmountFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [viewDialog, setViewDialog] = useState(false);
  const [endDialog, setEndDialog] = useState(false);

  const [assignDriverDialog, setAssignDriverDialog] = useState(false);

  React.useEffect(() => {
    setLoading(
      orderData.isLoading || getZones.isLoading || getDeliveries.isLoading
    );
    if (orderData.isSuccess) {
      setOrders(orderData.data);
    }
    if (getZones.isSuccess) {
      setZones(getZones.data);
    }
    if (getDeliveries.isSuccess) {
      setDeliveries(getDeliveries.data);
    }
  }, [
    setLoading,
    setZones,
    setOrders,
    setDeliveries,
    getZones.data,
    getZones.isLoading,
    getZones.isSuccess,
    orderData.data,
    orderData.isLoading,
    orderData.isSuccess,
    getDeliveries.data,
    getDeliveries.isLoading,
    getDeliveries.isSuccess,
  ]);

  /**Period filter settings */
  function isWithinPeriod(date: Date | string, period: string): boolean {
    const createdAt = new Date(date);
    const now = new Date();

    switch (period) {
      case "1days":
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

  const filteredOrders = React.useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        statusMap[statusFilter]?.includes(order.status);

      const matchesPayment =
        paymentFilter === "all" ||
        (order.payment?.status &&
          paymentStatusMap[paymentFilter]?.includes(order.payment.status));

      const matchesPeriod =
        periodFilter === "all" || isWithinPeriod(order.createdAt, periodFilter);

      const matchesZone =
        zoneFilter === "all" || order.address?.zone?.name === zoneFilter;

      const matchesAmount = (() => {
        const amount = order.total;
        switch (amountFilter) {
          case "0-20":
            return amount < 20000;
          case "20-50":
            return amount >= 20000 && amount <= 50000;
          case "50-100":
            return amount > 50000 && amount <= 100000;
          case "100+":
            return amount > 100000;
          default:
            return true;
        }
      })();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment &&
        matchesPeriod &&
        matchesZone &&
        matchesAmount
      );
    });
  }, [
    orders,
    searchTerm,
    statusFilter,
    paymentFilter,
    periodFilter,
    zoneFilter,
    amountFilter,
  ]);

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setViewDialog(true);
  };

  const handleAssign = (order: Order) => {
    setSelectedOrder(order);
    setAssignDriverDialog(true);
  };

  const handleEnd = (order: Order) => {
    setSelectedOrder(order);
    setEndDialog(true);
  };

  return (
    <PageLayout
      isLoading={
        orderData.isLoading || getZones.isLoading || getDeliveries.isLoading
      }
      className="flex-1 overflow-auto p-4 space-y-6"
    >
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
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Statut commande" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{"Tous les statuts"}</SelectItem>
                <SelectItem value="En cours">{"En cours"}</SelectItem>
                <SelectItem value="Préparation">{"Préparation"}</SelectItem>
                <SelectItem value="En livraison">{"En livraison"}</SelectItem>
                <SelectItem value="Livré">{"Livré"}</SelectItem>
                <SelectItem value="Annulé">{"Annulé"}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Statut paiement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{"Tous les paiements"}</SelectItem>
                <SelectItem value="Payé">{"Payé"}</SelectItem>
                <SelectItem value="En attente">{"En attente"}</SelectItem>
                <SelectItem value="Échoué">{"Échoué"}</SelectItem>
                <SelectItem value="Rejeté">{"Rejeté"}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{"Toutes les dates"}</SelectItem>
                <SelectItem value="1days">{"Aujourd'hui"}</SelectItem>
                <SelectItem value="7days">{"Cette semaine"}</SelectItem>
                <SelectItem value="30days">{"Ce mois"}</SelectItem>
                <SelectItem value="90days">{"Ce trimestre"}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={zoneFilter} onValueChange={setZoneFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Zone de livraison" />
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

            <Select value={amountFilter} onValueChange={setAmountFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Montant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{"Tous les montants"}</SelectItem>
                <SelectItem value="0-20">{"Moins de 20 000"}</SelectItem>
                <SelectItem value="20-50">{"20 000 - 50 000"}</SelectItem>
                <SelectItem value="50-100">{"50 000 - 100 000"}</SelectItem>
                <SelectItem value="100+">{"Plus de 100 000"}</SelectItem>
              </SelectContent>
            </Select>

            {/* <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              {"Filtres avancés"}
            </Button>
 */}
            <Button>
              <PDFDownloadLink
                document={<OrdersPDFDocument orders={filteredOrders} />}
                fileName="liste-commandes.pdf"
              >
                {({ loading }) =>
                  loading ? <Loader size={16} /> : "Exporter en PDF"
                }
              </PDFDownloadLink>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      {orderData.isSuccess && (
        <Card>
          <CardHeader>
            <CardTitle>{`Commandes (${filteredOrders.length})`}</CardTitle>
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
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-gray-500 py-5 sm:text-lg xl:text-xl"
                    >
                      {"Aucune commande trouvée"}
                      <img
                        src={"/images/search.png"}
                        alt="no-image"
                        className="w-1/3 max-w-32 h-auto mx-auto mt-5 opacity-20"
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
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
                      <TableCell>
                        {order.address && (
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {
                                zones.find((x) => x.id === order.address?.id)
                                  ?.name
                              }
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {order.address.street}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {XAF.format(order.total)}
                      </TableCell>
                      <TableCell>{`${order.weight} kg`}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === "ACCEPTED"
                              ? "default"
                              : order.status === "PENDING"
                              ? "info"
                              : order.status === "COMPLETED"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {getOrderStatusLabel(order.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            !order.payment
                              ? "destructive"
                              : order.payment.status === "ACCEPTED"
                              ? "default"
                              : order.payment.status === "PENDING"
                              ? "info"
                              : order.payment.status === "COMPLETED"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {!order.payment
                            ? "Non Payé"
                            : order.payment.status === "ACCEPTED"
                            ? "Accepté"
                            : order.payment.status === "PENDING"
                            ? "En cours"
                            : order.payment.status === "COMPLETED"
                            ? "Payé"
                            : "Non Payé"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size={"icon"}>
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{"Actions"}</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => {
                                handleView(order);
                              }}
                            >
                              <Eye size={16} />
                              {"Voir les détails"}
                            </DropdownMenuItem>
                            {!deliveries.find(
                              (z) => z.orderId === order.id
                            ) && (
                              <DropdownMenuItem
                                onClick={() => {
                                  handleAssign(order);
                                }}
                              >
                                <SquareChevronRight size={16} />
                                {"Assigner"}
                              </DropdownMenuItem>
                            )}
                            {(order.status === "ACCEPTED" ||
                              order.status === "PENDING" ||
                              order.status === "PROCESSING") && (
                              <DropdownMenuItem
                                onClick={() => {
                                  handleEnd(order);
                                }}
                              >
                                <CheckCircleIcon size={16} />
                                {"Terminer"}
                              </DropdownMenuItem>
                            )}
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
      )}
      {selectedOrder && (
        <ViewOrder
          order={selectedOrder}
          openChange={setViewDialog}
          isOpen={viewDialog}
          zones={zones}
        />
      )}
      {selectedOrder && getZones.isSuccess && (
        <AssignDriver
          openChange={setAssignDriverDialog}
          isOpen={assignDriverDialog}
          order={selectedOrder}
          zones={zones}
        />
      )}
      {selectedOrder && (
        <EndOrder
          openChange={setEndDialog}
          isOpen={endDialog}
          order={selectedOrder}
        />
      )}
    </PageLayout>
  );
}
