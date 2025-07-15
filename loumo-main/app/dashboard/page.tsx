"use client";

import { DateRangePicker } from "@/components/dateRangePicker";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchAll } from "@/hooks/useData";
import {
  getClientsByDay,
  getOrderStatusLabel,
  sortOrdersByNewest,
  XAF
} from "@/lib/utils";
import { useStore } from "@/providers/datastore";
import OrderQuery from "@/queries/order";
import ProductQuery from "@/queries/product";
import ShopQuery from "@/queries/shop";
import StockQuery from "@/queries/stock";
import UserQuery from "@/queries/user";
import { Order, Product, Shop, Stock, User } from "@/types/types";
import {
  AlertTriangle,
  Candy,
  DollarSign,
  Filter,
  Package,
  ShoppingCart,
  Store,
  TriangleAlert,
  UsersIcon,
  Warehouse
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { DateRange } from "react-day-picker";
import {
  Bar,
  BarChart,
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
  const getOrders = fetchAll(ordersQuery.getAll, "orders",60000);

  const clientsQuery = new UserQuery();
  const getClients = fetchAll(clientsQuery.getAll, "clients",60000);

  const stockQuery = new StockQuery();
  const getStocks = fetchAll(stockQuery.getAll, "stocks",60000);

  const shopQuery = new ShopQuery();
  const getShops = fetchAll(shopQuery.getAll, "shops",60000);


  const productQuery = new ProductQuery();
  const getProducts = fetchAll(productQuery.getAll, "products",60000);

  const [orders, setOrders] = React.useState<Order[]>([]);
  const [clients, setClients] = React.useState<User[]>([]);
  const [stocks, setStocks] = React.useState<Stock[]>([]);
  const [shops, setShops] = React.useState<Shop[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);

  const [shopFilter, setShopFilter] = React.useState<string>("all");
  const [productFilter, setProductFilter] = React.useState<string>("all");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
  from: undefined,
  to: undefined,
})


  React.useEffect(() => {
    setLoading(
      getOrders.isLoading ||
        getClients.isLoading ||
        getStocks.isLoading ||
        getShops.isLoading ||
        getProducts.isLoading
    );
    if (getOrders.isSuccess) setOrders(getOrders.data);
    if (getClients.isSuccess) setClients(getClients.data);
    if (getStocks.isSuccess) setStocks(getStocks.data);
    if (getShops.isSuccess) setShops(getShops.data);
    if (getProducts.isSuccess) setProducts(getProducts.data);
  }, [
    setLoading,
    setStocks,
    setOrders,
    setClients,
    setShops,
    setProducts,
    getOrders.isLoading,
    getClients.isLoading,
    getStocks.isLoading,
    getShops.isLoading,
    getProducts.isLoading,
    getOrders.isSuccess,
    getClients.isSuccess,
    getStocks.isSuccess,
    getShops.isSuccess,
    getProducts.isSuccess,
    getOrders.data,
    getClients.data,
    getStocks.data,
    getShops.data,
    getProducts.data,
  ]);

  const filteredOrders = React.useMemo(() => {
  return orders.filter((order) => {
    const createdAt = new Date(order.createdAt);

    // Filtrage par date (range)
    const matchesDate =
      (!dateRange?.from || createdAt >= new Date(dateRange.from.setHours(0, 0, 0, 0))) &&
      (!dateRange?.to || createdAt <= new Date(dateRange.to.setHours(23, 59, 59, 999)));

    // Filtrage par boutique
    const matchesShop =
      shopFilter === "all" ||
      String(order.address?.zoneId ?? "") === shopFilter;

    // Filtrage par produit
    const matchesProduct =
      productFilter === "all" ||
      order.orderItems?.some(
        (x) => x.productVariant?.productId === Number(productFilter)
      );

    return matchesDate && matchesShop && matchesProduct;
  });
}, [orders, shopFilter, productFilter, dateRange]);




  //Sales
  const salesCompleted = (orders: Order[]): number => {
    return orders
      .filter((x) => !!x.payment)
      .reduce((total, item) => total + item.total, 0);
  };

  //Clients variables
  const activeClients: User[] = clients.filter((x) => x.active);
  const todayClients: User[] = getClientsByDay(activeClients);

  //Stocks
  const lowStocks: Stock[] = stocks.filter((x) => x.quantity <= x.threshold);
  const toRestock: Stock[] = stocks.filter((x) => x.quantity === 0);

  //graph orders
  const ordersByDay = Array.from({ length: 7 })
    .map((_, i) => {
      const offset = -i;
      const day = new Date();
      day.setDate(day.getDate() + offset);

      const ordersOfDay = filteredOrders.filter((order) => {
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
        getOrders.isLoading ||
        getClients.isLoading ||
        getStocks.isLoading ||
        getShops.isLoading ||
        getProducts.isLoading
      }
      className="flex-1 overflow-auto p-4 space-y-6"
    >
      {/**Filters */}
      <div className="p-6 w-full bg-white rounded-lg flex flex-wrap justify-between items-center gap-4 sm:gap-6 shadow-sm">
        <h4 className="font-semibold text-sm sm:text-base flex gap-2 items-center"><Filter size={16}/> {"Filtres"}</h4>
        <div className="flex gap-3 flex-wrap">
          <DateRangePicker date={dateRange} onChange={setDateRange} />
          <Select value={shopFilter} onValueChange={setShopFilter}>
            <SelectTrigger>
              <Store size={16} />
              <SelectValue placeholder="Point de vente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{"Toutes les boutiques"}</SelectItem>
              {shops.map((x) => (
                <SelectItem key={x.id} value={String(x.id)}>
                  {x.name}
                </SelectItem>
              ))}
              {shops.length === 0 && <SelectItem value="disabled" disabled>{"Aucune boutique"}</SelectItem>}
            </SelectContent>
          </Select>
          <Select value={productFilter} onValueChange={setProductFilter}>
            <SelectTrigger>
              <Candy size={16} />
              <SelectValue placeholder="Produit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{"Toutes les produits"}</SelectItem>
              {products.map((x) => (
                <SelectItem key={x.id} value={String(x.id)}>
                  {x.name}
                </SelectItem>
              ))}
              {products.length === 0 && <SelectItem value="disabled" disabled>{"Aucun produit enregistré"}</SelectItem>}
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Commandes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Commandes"}
            </CardTitle>
            <ShoppingCart size={16} className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredOrders.length}</div>
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
              {XAF.format(salesCompleted(filteredOrders))}
            </div>
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
              {orders.length === 0 ? (
                <div className="flex flex-col gap-4 items-center pt-7">
                  <img
                    src={"/images/cart-empty.png"}
                    alt="cart empty"
                    className="max-w-[120px] w-[5vw] h-auto opacity-40"
                  />
                  <p className="text-lg lg:text-xl text-muted-foreground italic text-center">
                    {"Aucune commande enregistrée"}
                  </p>
                  <Link href={"/dashboard/products"}>
                    <Button>
                      <Package size={16} />
                      {"Gérer les produits"}
                    </Button>
                  </Link>
                </div>
              ) : (
                sortOrdersByNewest(orders)
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
                  ))
              )}
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
              {"Suivez l'évolution des commandes"}
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
              {"Évolution du chiffre d'affaires sur une période"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getSalesByDay(filteredOrders)} barSize={30}>
                <XAxis dataKey="date" tickLine={false} axisLine={true} />
                {/* On supprime YAxis */}
                <Tooltip
                  formatter={(value) => XAF.format(Number(value))}
                  labelFormatter={(label) => `Jour : ${label}`}
                />
                <Bar
                  dataKey="total"
                  fill="#018e97"
                  className=""
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
