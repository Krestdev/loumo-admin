"use client";

import { DateRangePicker } from "@/components/dateRangePicker";
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
import { fetchAll } from "@/hooks/useData";
import { exportToExcel } from "@/lib/exportToExcel";
import {
  getDeliveryStatusName,
  getOrderStatusLabel,
  payStatusName,
  XAF
} from "@/lib/utils";
import { useStore } from "@/providers/datastore";
import DeliveryQuery from "@/queries/delivery";
import OrderQuery from "@/queries/order";
import ZoneQuery from "@/queries/zone";
import { Delivery, Order, OrderStatus, Payment, Product, Zone } from "@/types/types";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  ArrowRightCircle,
  ArrowUpDown,
  BadgeCheck,
  CheckCircleIcon,
  DollarSign,
  Download,
  Eye,
  Loader,
  MoreHorizontal,
  Search,
  SquareChevronRight,
  Store,
} from "lucide-react";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import AssignDriver from "./assign";
import EndOrder from "./end";
import { OrdersPDFDocument } from "./pdf";
import ViewOrder from "./view";
import ProductQuery from "@/queries/product";

export default function OrdersPage() {
  const ordersQuery = new OrderQuery();
  const orderData = fetchAll(ordersQuery.getAll, "orders", 30000);

  const zoneQuery = new ZoneQuery();
  const getZones = fetchAll(zoneQuery.getAll, "zones", 30000);

  const deliveryQuery = new DeliveryQuery();
  const getDeliveries = fetchAll(deliveryQuery.getAll, "deliveries", 30000);

  const productQuery = new ProductQuery();
  const getProducts = fetchAll(productQuery.getAll, "products", 30000);

  const [orders, setOrders] = useState<Order[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const { setLoading } = useStore();

  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  //const [periodFilter, setPeriodFilter] = useState("all");
  const [amountFilter, setAmountFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc"); // "desc" = latest first
  const [viewDialog, setViewDialog] = useState(false);
  const [endDialog, setEndDialog] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

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
    if (getProducts.isSuccess) {
      setProducts(getProducts.data);
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
    getProducts.data,
    getProducts.isLoading,
    getProducts.isSuccess,
  ]);

  const orderStatus: OrderStatus[] = [
    "ACCEPTED",
    "COMPLETED",
    "FAILED",
    "PENDING",
    "PROCESSING",
    "REJECTED",
  ] as const;

  const paymentStatus: Payment["status"][] = [
    "ACCEPTED",
    "COMPLETED",
    "FAILED",
    "PENDING",
    "PROCESSING",
    "REJECTED",
  ];

  const filteredOrders = React.useMemo(() => {
    return orders
      .filter((order) => {
        const matchesSearch =
          order.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toString().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "all" ||
          order.status === statusFilter;

        const matchesPayment =
          paymentFilter === "all" ||
          paymentFilter === (order.payment ? order.payment?.status : "undefined") ;

        /* const matchesPeriod =
          periodFilter === "all" ||
          isWithinPeriod(order.createdAt, periodFilter); */

        const matchesDate =
          (!dateRange?.from ||
            new Date(order.createdAt) >=
              new Date(dateRange.from.setHours(0, 0, 0, 0))) &&
          (!dateRange?.to ||
            new Date(order.createdAt) <=
              new Date(dateRange.to.setHours(23, 59, 59, 999)));

        const matchesZone =
          zoneFilter === "all" || order.address?.zoneId === Number(zoneFilter);

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
          //matchesPeriod &&
          matchesZone &&
          matchesAmount &&
          matchesDate
        );
      })
      .sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return sortDirection === "desc" ? timeB - timeA : timeA - timeB;
      });
  }, [
    orders,
    searchTerm,
    statusFilter,
    paymentFilter,
    //periodFilter,
    zoneFilter,
    amountFilter,
    sortDirection,
    dateRange,
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

  //Export xlsx
  const handleExcelExport = (orders: Order[]) => {
    const formattedOrders = orders.map((order) => ({
      ID: order.id,
      "Nom du Client": order.user.name,
      "Email du Client": order.user.email,
      Montant: order.total,
      Statut: getOrderStatusLabel(order.status),
      Paiement: order.payment
        ? payStatusName(order.payment.status)
        : "Non payé",
      Livraison: order.delivery
        ? getDeliveryStatusName(order.delivery[0].status)
        : "Non livré",
      Adresse: order.address
        ? `${order.address.local} - ${order.address.street}`
        : "N/A",
      Date: new Date(order.createdAt).toLocaleDateString(),
    }));

    exportToExcel(formattedOrders, "Commandes LoumoShop");
  };

  return (
    <PageLayout
      isLoading={
        orderData.isLoading || getZones.isLoading || getDeliveries.isLoading || getProducts.isLoading
      }
      className="flex-1 overflow-auto p-4 space-y-6"
    >
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{"Filtres"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">{"Recherche"}</label>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par client ou numéro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {"Classer par ordre"}
              </label>
              <Select
                value={sortDirection}
                onValueChange={(value) =>
                  setSortDirection(value as "asc" | "desc")
                }
              >
                <SelectTrigger className="w-full">
                  <ArrowUpDown size={16} />
                  <SelectValue placeholder="Trier par date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">{"Les plus récentes"}</SelectItem>
                  <SelectItem value="asc">{"Les plus anciennes"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{"Statut"}</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <BadgeCheck size={16} />
                  <SelectValue placeholder="Statut commande" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"Tous les statuts"}</SelectItem>
                  {orderStatus.map((x, i) => (
                    <SelectItem key={i} value={x}>
                      {getOrderStatusLabel(x)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {"Etat du paiement"}
              </label>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-full">
                  <ArrowRightCircle size={16} />
                  <SelectValue placeholder="Statut paiement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"Tous les paiements"}</SelectItem>
                  {paymentStatus.map((x, id) => (
                    <SelectItem key={id} value={x}>
                      {payStatusName(x)}
                    </SelectItem>
                  ))}
                  <SelectItem value="undefined">{"Non Payé"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{"Période"}</label>
              <DateRangePicker
                date={dateRange}
                onChange={setDateRange}
                className="!w-full"
              />
            </div>
            {/* <div className="space-y-2">
              <label className="text-sm font-medium">{"Période"}</label>
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
            </div> */}

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {"Zone de livraison"}
              </label>
              <Select value={zoneFilter} onValueChange={setZoneFilter}>
                <SelectTrigger className="w-full">
                  <Store size={16} />
                  <SelectValue placeholder="Zone de livraison" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"Toutes les zones"}</SelectItem>
                  {zones.map((x) => (
                    <SelectItem key={x.id} value={String(x.id)}>
                      {x.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{"Montant"}</label>
              <Select value={amountFilter} onValueChange={setAmountFilter}>
                <SelectTrigger className="w-full">
                  <DollarSign size={16} />
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
            </div>
            <div className="flex items-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="w-full" variant={"default"}>
                    <Download size={16} />
                    {"Exporter"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60">
                  <DropdownMenuItem className="w-full">
                    <PDFDownloadLink
                      document={<OrdersPDFDocument orders={filteredOrders} />}
                      fileName="liste-commandes.pdf"
                      className="w-full"
                    >
                      {({ loading }) =>
                        loading ? (
                          <Loader size={16} className="animate-spin" />
                        ) : (
                          <span>{"vers PDF"}</span>
                        )
                      }
                    </PDFDownloadLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleExcelExport(filteredOrders)}
                  >
                    {"vers Excel"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
                  <TableHead>{"Livraison"}</TableHead>
                  <TableHead>{"Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
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
                      <TableCell className="font-medium">{order.ref}</TableCell>
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
                            : payStatusName(order.payment.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {!!order.delivery ? (
                          <Badge
                            variant={
                              order.delivery[0].status === "COMPLETED"
                                ? "default"
                                : order.delivery[0].status === "CANCELED"
                                ? "destructive"
                                : order.delivery[0].status === "NOTSTARTED"
                                ? "warning"
                                : "info"
                            }
                          >
                            {getDeliveryStatusName(order.delivery[0].status)}
                          </Badge>
                        ) : (
                          "N/A"
                        )}
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
        products={products}
          order={selectedOrder}
          openChange={setViewDialog}
          isOpen={viewDialog}
          zones={zones}
          delivery={deliveries.find((x) => x.orderId === selectedOrder.id)}
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
