"use client";

import { DateRangePicker } from "@/components/dateRangePicker";
import PageLayout from "@/components/page-layout";
import { Badge } from "@/components/ui/badge";
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
import { payStatusName, XAF } from "@/lib/utils";
import { useStore } from "@/providers/datastore";
import OrderQuery from "@/queries/order";
import PaymentQuery from "@/queries/payment";
import ShopQuery from "@/queries/shop";
import { Order, Payment, Shop } from "@/types/types";
import { formatRelative } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AlertCircle,
  Ban,
  CheckCheck,
  CheckCircle,
  CircleCheck,
  CircleX,
  Clock,
  CreditCard,
  DollarSign,
  Ellipsis,
  Filter,
  RefreshCw,
  Search,
  Smartphone,
  Store,
  Tag,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";

const paymentMethods: Payment["method"][] = [
  "CASH",
  "MTN_MOMO_CMR",
  "ORANGE_CMR",
];

  const paymentStatus: Payment["status"][] = [
  "ACCEPTED",
  "COMPLETED",
  "FAILED",
  "PENDING",
  "PROCESSING",
  "REJECTED",
];

export default function PaymentsPage() {
  const paymentQuery = new PaymentQuery();
  const getPayments = fetchAll(paymentQuery.getAll, "payments", 60000);

  const ordersQuery = new OrderQuery();
  const getOrders = fetchAll(ordersQuery.getAll, "orders", 60000);

  const shopQuery = new ShopQuery();
  const getShops = fetchAll(shopQuery.getAll, "shops");

  const { setLoading } = useStore();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [shopFilter, setShopFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })

  useEffect(() => {
    setLoading(getPayments.isLoading);
    if (getPayments.isSuccess) setPayments(getPayments.data);
    if (getOrders.isSuccess) setOrders(getOrders.data);
    if (getShops.isSuccess) setShops(getShops.data);
  }, [
    setLoading,
    setPayments,
    setOrders,
    setShops,
    getPayments.isLoading,
    getPayments.isSuccess,
    getPayments.data,
    getOrders.isLoading,
    getOrders.isSuccess,
    getOrders.data,
    getShops.isLoading,
    getShops.isSuccess,
    getShops.data,
  ]);

  const filteredPayments = useMemo(()=>{
    return payments.filter((payment)=>{

      const order = orders.find((z) => payment.orderId === z.id);
      const createdAt = order ? new Date(order.createdAt) : new Date();
      // Filtrage par date (range)
    const matchesDate =
      (!dateRange?.from || createdAt >= new Date(dateRange.from.setHours(0, 0, 0, 0))) &&
      (!dateRange?.to || createdAt <= new Date(dateRange.to.setHours(23, 59, 59, 999)));
      //Search filter
      const matchesSearch =
      order?.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(payment.orderId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(payment.id).toLowerCase().includes(searchTerm.toLowerCase());
      //Status filter
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;
      //Method filter
    const matchesMethod =
      methodFilter === "all" || payment.method === methodFilter;
      //Shop filter
      const matchesShop = 
      shopFilter === "all" || order?.address?.zoneId === Number(shopFilter)

    return matchesSearch && matchesStatus && matchesMethod && matchesDate && matchesShop;
    })
  },[
    payments, orders, searchTerm, dateRange, statusFilter, shopFilter, methodFilter
  ]);

  function getStatusColor(status: Payment["status"]) {
    switch (status) {
      case "COMPLETED":
        return "default";
      case "PENDING":
      case "PROCESSING":
      case "ACCEPTED":
        return "secondary";
      case "FAILED":
      case "REJECTED":
        return "destructive";
      default:
        return "outline";
    }
  }

  const getMethodIcon = (method: Payment["method"]) => {
    switch (method) {
      case "CASH":
        return DollarSign;
      default:
        return Smartphone;
    }
  };

  const getStatusIcon = (status: Payment["status"]) => {
    switch (status) {
      case "ACCEPTED":
        return CircleCheck;
      case "FAILED":
        return CircleX;
      case "COMPLETED":
        return CheckCheck;
      case "PENDING":
        return Ellipsis;
      case "PROCESSING":
        return RefreshCw;
      default:
        return Ban;
    }
  };

  const payMethodName = (method: Payment["method"]): string => {
    switch (method) {
      case "CASH":
        return "Espèces";
      case "MTN_MOMO_CMR":
        return "MTN MOMO";
      case "ORANGE_CMR":
        return "Orange Money";
      default:
        return "Espèces";
    }
  };

  const methodFees = (method: Payment["method"]): string => {
    switch (method) {
      case "CASH":
        return "0%";
      default:
        return "2%";
    }
  };

  const successPayments: Payment[] = filteredPayments.filter(
    (x) => x.status === "COMPLETED"
  );

  //orders
  const isSameDayOffset = (date: string | Date, offset: number) => {
    const d = new Date(date);
    const ref = new Date();
    ref.setDate(ref.getDate() + offset); // offset = 0 => aujourd'hui, -1 => hier
    return (
      d.getFullYear() === ref.getFullYear() &&
      d.getMonth() === ref.getMonth() &&
      d.getDate() === ref.getDate()
    );
  };

  const getSalesByOffset = (orders: Order[], offset: number) =>
    orders
      .filter((o) => !!o.payment && isSameDayOffset(o.createdAt, offset))
      .reduce((total, o) => total + o.total, 0);

  // Ventes du jour (offset = 0)
  const todaySales = getSalesByOffset(filteredPayments.map(x=> x.order), 0);

  // Ventes d’hier (offset = -1)
  const yesterdaySales = getSalesByOffset(filteredPayments.map(x=> x.order), -1);

  // Différence et variation
  const salesDiff = todaySales - yesterdaySales;
  const salesVariation =
    yesterdaySales > 0 ? (salesDiff * 100) / yesterdaySales : 0;

  return (
    <PageLayout
      isLoading={getPayments.isLoading || getOrders.isLoading || getShops.isLoading}
      className="p-4 space-y-6"
    >
      {/**Filtres */}
      <div className="p-6 w-full bg-white rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-4 shadow-sm">
        <h4 className="font-semibold text-sm sm:text-base flex gap-2 items-center"><Filter size={16}/> {"Filtres"}</h4>
          <div className="space-y-2">
            <label className="text-sm font-medium">{"Période"}</label>
            <DateRangePicker date={dateRange} onChange={setDateRange} className="!w-full" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{"Statut du paiement"}</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <Tag size={16}/>
                  <SelectValue placeholder="Statut"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"Tous"}</SelectItem>
                  {paymentStatus.map((x, id) => (
                    <SelectItem key={id} value={x}>
                      {payStatusName(x)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{"Méthode de paiement"}</label>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-full">
                <DollarSign size={16}/>
                <SelectValue placeholder="Méthode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{"Toutes"}</SelectItem>
                {paymentMethods.map((item, id) => (
                  <SelectItem key={id} value={item}>
                    {payMethodName(item)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{"Point de vente"}</label>
            <Select value={shopFilter} onValueChange={setShopFilter}>
            <SelectTrigger className="w-full">
              <Store size={16} />
              <SelectValue placeholder="Point de vente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{"Toutes les boutiques"}</SelectItem>
              {shops.map((shop) => (
                <SelectItem key={shop.id} value={String(shop.id)}>
                  {shop.name}
                </SelectItem>
              ))}
              {shops.length === 0 && <SelectItem value="disabled" disabled>{"Aucune boutique"}</SelectItem>}
            </SelectContent>
          </Select>
          </div>
      </div>

      {/* Payment Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Volume"}
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{XAF.format(todaySales)}</div>
            {!!salesVariation && (
              <p className="text-xs text-muted-foreground">
                <span
                  className={
                    salesDiff > 0 ? "text-green-600" : "text-destructive"
                  }
                >{`${salesDiff > 0 ? "+" : "-"}${salesVariation}`}</span>
                {" vs hier"}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Transactions réussies"}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successPayments.length > 0 ? `${
              (successPayments.length * 100) / payments.length
            }%` : "0%"}</div>
            <p className="text-xs text-muted-foreground">
              {"Taux de réussite"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"En attente"}
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                filteredPayments.filter((x) => x.status === "PENDING")
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {"Paiements à traiter"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Frais de livraison"}
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {XAF.format(
                filteredPayments.reduce(
                  (total, el) => total + (el.order?.deliveryFee ?? 0),
                  0
                )
              )}
            </div>
            {/* <p className="text-xs text-muted-foreground">Ce mois</p> */}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>{"Méthodes de paiement"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentMethods.map((method, index) => {
                const Icon = getMethodIcon(method);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <div>
                        <p className="font-medium">{payMethodName(method)}</p>
                        <p className="text-sm text-muted-foreground">{`Frais: ${methodFees(
                          method
                        )}`}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mt-1">
                        {`${
                          orders.filter((x) => x.payment?.method === method)
                            .length
                        } trans.`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{"Transactions récentes"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments.slice(0, 5).map((payment) => {
                const StatusIcon = getStatusIcon(payment.status);
                const MethodIcon = getMethodIcon(payment.method);
                const currentOrder = orders.find(
                  (x) => x.id === payment.orderId
                );
                return (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <MethodIcon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {currentOrder?.user.name ?? "--"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {payment.ref} •{" "}
                          {payMethodName(payment.method)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {XAF.format(currentOrder?.total ?? 0)}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <StatusIcon className="h-3 w-3" />
                        <Badge
                          variant={getStatusColor(payment.status)}
                          className="text-xs"
                        >
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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
                  placeholder="Rechercher par client, commande ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>{`Toutes les transactions (${filteredPayments.length})`}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{"Transaction"}</TableHead>
                <TableHead>{"Commande"}</TableHead>
                <TableHead>{"Client"}</TableHead>
                <TableHead>{"Montant"}</TableHead>
                <TableHead>{"Méthode"}</TableHead>
                <TableHead>{"Statut"}</TableHead>
                <TableHead>{"Date"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-gray-500 py-5 sm:text-lg xl:text-xl"
                  >
                    {"Aucune transaction trouvée"}
                    <img
                      src={"/images/search.png"}
                      alt="no-image"
                      className="w-1/3 max-w-32 h-auto mx-auto mt-5 opacity-20"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => {
                  const MethodIcon = getMethodIcon(payment.method);
                  const currentOrder = orders.find(
                    (x) => x.id === payment.orderId
                  );
                  return (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium uppercase">
                        {payment.ref}
                      </TableCell>
                      <TableCell className="uppercase">{payment.order.ref}</TableCell>
                      <TableCell>{currentOrder?.user.name ?? "--"}</TableCell>
                      <TableCell>
                        {XAF.format(currentOrder?.total ?? 0)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MethodIcon className="h-4 w-4" />
                          <span>{payMethodName(payment.method)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Badge variant={getStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{formatRelative(new Date(payment.updatedAt ?? payment.createdAt), new Date(), {locale: fr})}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
