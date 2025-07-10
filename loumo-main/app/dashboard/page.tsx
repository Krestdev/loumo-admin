"use client";

import PageLayout from "@/components/page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  getClientsByDay,
  getOrdersByDay,
  getOrderStatusLabel,
  sortOrdersByNewest,
  XAF,
} from "@/lib/utils";
import { useStore } from "@/providers/datastore";
import OrderQuery from "@/queries/order";
import StockQuery from "@/queries/stock";
import UserQuery from "@/queries/user";
import { Order, Stock, User } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  TriangleAlert,
  UsersIcon,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function Dashboard() {
  const { setLoading } = useStore();

  const ordersQuery = new OrderQuery();
  const getOrders = useQuery({
    queryKey: ["orders"],
    queryFn: ordersQuery.getAll,
  });

  const clientsQuery = new UserQuery();
  const getClients = useQuery({
    queryKey: ["clients"],
    queryFn: () => clientsQuery.getAllClients(),
    refetchOnWindowFocus: false,
  });

  const stockQuery = new StockQuery();
  const getStocks = useQuery({
    queryKey: ["stocks"],
    queryFn: () => stockQuery.getAll(),
  });

  const [orders, setOrders] = React.useState<Order[]>([]);
  const [clients, setClients] = React.useState<User[]>([]);
  const [stocks, setStocks] = React.useState<Stock[]>([]);

  React.useEffect(() => {
    setLoading(
      getOrders.isLoading || getClients.isLoading || getStocks.isLoading
    );
    if (getOrders.isSuccess) setOrders(getOrders.data);
    if (getClients.isSuccess) setClients(getClients.data);
    if (getStocks.isSuccess) setStocks(getStocks.data);
  }, [
    setLoading,
    setStocks,
    setOrders,
    setClients,
    getOrders.isLoading,
    getClients.isLoading,
    getStocks.isLoading,
    getOrders.isSuccess,
    getClients.isSuccess,
    getStocks.isSuccess,
    getOrders.data,
    getClients.data,
    getStocks.data,
  ]);

  //Orders
  const todayOrders: Order[] = getOrdersByDay(orders);
  const previousOrders: Order[] = getOrdersByDay(orders, -1);
  const ordersDiff: number = todayOrders.length - previousOrders.length;

  //Sales
  const salesCompleted = (orders: Order[]): number => {
    return orders
      .filter((x) => !!x.payment)
      .reduce((total, item) => total + item.total, 0);
  };
  const salesDiff: number =
    salesCompleted(todayOrders) - salesCompleted(previousOrders);

  //Clients variables
  const activeClients: User[] = clients.filter((x) => x.active);
  const todayClients: User[] = getClientsByDay(activeClients);
  const previousClients: User[] = getClientsByDay(activeClients, -1);

  //Stocks
  const lowStocks: Stock[] = stocks.filter((x) => x.quantity <= x.threshold);
  const toRestock: Stock[] = stocks.filter((x) => x.quantity === 0);

  //graph orders
  const ordersByDay = Array.from({ length: 7 })
    .map((_, i) => {
      const offset = -i;
      const day = new Date();
      day.setDate(day.getDate() + offset);

      const ordersOfDay = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate.getFullYear() === day.getFullYear() &&
          orderDate.getMonth() === day.getMonth() &&
          orderDate.getDate() === day.getDate()
        );
      });

      return {
        date: day.toLocaleDateString("fr-FR", { weekday: "short" }),
        total: ordersOfDay.length,
      };
    })
    .reverse();

  //graph CA
  const getSalesByDay = (orders: Order[], days = 7) => {
    return Array.from({ length: days })
      .map((_, i) => {
        const offset = -i;
        const day = new Date();
        day.setDate(day.getDate() + offset);

        const salesOfDay = orders.filter((order) => {
          const orderDate = new Date(order.createdAt);
          return (
            orderDate.getFullYear() === day.getFullYear() &&
            orderDate.getMonth() === day.getMonth() &&
            orderDate.getDate() === day.getDate() &&
            !!order.payment
          );
        });

        const totalSales = salesOfDay.reduce((acc, o) => acc + o.total, 0);

        return {
          date: day.toLocaleDateString("fr-FR", { weekday: "short" }),
          total: totalSales,
        };
      })
      .reverse();
  };

  return (
    <PageLayout
      isLoading={
        getOrders.isLoading || getClients.isLoading || getStocks.isLoading
      }
      className="flex-1 overflow-auto p-4 space-y-6"
    >
      {/* Commandes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Commandes d'aujourd'hui"}
            </CardTitle>
            <ShoppingCart size={16} className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayOrders.length}</div>
            {previousOrders.length > 0 && (
              <p className="text-xs text-muted-foreground">
                <span
                  className={ordersDiff > 0 ? "text-green-600" : "text-red-600"}
                >
                  {`${ordersDiff > 0 ? "+" : ordersDiff < 0 && "-"}${
                    (ordersDiff * 100) / previousOrders.length
                  }%`}
                </span>
                {" par rapport à hier"}
              </p>
            )}
          </CardContent>
        </Card>
        {/**Chiffre d'Affaires */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Chiffre d'Affaires"}
            </CardTitle>
            <DollarSign size={16} className="text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {XAF.format(salesCompleted(todayOrders))}
            </div>
            {salesCompleted(previousOrders) > 0 && (
              <p className="text-xs text-muted-foreground">
                <span
                  className={salesDiff > 0 ? "text-green-600" : "text-red-600"}
                >
                  {`${salesDiff > 0 ? "+" : salesDiff < 0 && "-"}${
                    (salesDiff * 100) / salesCompleted(previousOrders)
                  }%`}
                </span>
                {" par rapport à hier"}
              </p>
            )}
          </CardContent>
        </Card>
        {/**Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Utilsateurs actifs"}
            </CardTitle>
            <UsersIcon size={16} className="text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayClients.length}</div>
            {salesCompleted(previousOrders) > 0 && (
              <p className="text-xs text-muted-foreground">
                <span
                  className={
                    todayClients.length - previousClients.length > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {`${
                    todayClients.length - previousClients.length > 0
                      ? "+"
                      : todayClients.length - previousClients.length < 0 && "-"
                  }${
                    ((todayClients.length - previousClients.length) * 100) /
                    previousClients.length
                  }%`}
                </span>
                {" par rapport à hier"}
              </p>
            )}
          </CardContent>
        </Card>
        {/**Inventory Stocks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Produits en rupture"}
            </CardTitle>
            <TriangleAlert size={16} className="text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{toRestock.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              {"Commandes récentes"}
            </CardTitle>
            <CardDescription>
              {"Les dernières commandes passées sur la plateforme"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortOrdersByNewest(orders)
                .slice(0, 4)
                .map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{`#ORD-${order.id}`}</span>
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
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.address?.local ?? order.addressId} •{" "}
                        {`Poids : ${order.weight} kg`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{XAF.format(order.total)}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              {"Alertes stock faible"}
            </CardTitle>
            <CardDescription>
              {"Produits nécessitant un réapprovisionnement"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStocks.length === 0 ? (
                <div className="flex flex-col gap-4 items-center pt-7">
                  <img
                    src={"/images/package.png"}
                    alt="stocks-ok"
                    className="max-w-[120px] w-[5vw] h-auto opacity-40"
                  />
                  <p className="text-lg lg:text-xl text-muted-foreground italic text-center">
                    {"Aucun produit nécessitant un réapprovisionnement"}
                  </p>
                  <Link href={"/dashboard/inventory"}>
                    <Button>
                      <Warehouse size={16} />
                      {"Gérer l'Inventaire"}
                    </Button>
                  </Link>
                </div>
              ) : (
                lowStocks.map((stock, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">
                          {stock.productVariant?.name ?? "Nom de la variante"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stock.shop?.name ?? "Nom du point de vente"}
                        </p>
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        {`${stock.quantity} restant`}
                      </Badge>
                    </div>
                    <Progress
                      value={(stock.quantity / stock.threshold) * 100}
                      className="h-2"
                    />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{"Historique des Commandes"}</CardTitle>
            <CardDescription>
              {"Commandes sur les 7 derniers jours"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ordersByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#10B981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{"Chiffre d'affaires quotidien"}</CardTitle>
            <CardDescription>
              {"Évolution du chiffre d'affaires sur les 7 derniers jours"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getSalesByDay(orders)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip formatter={(value) => XAF.format(Number(value))} />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
