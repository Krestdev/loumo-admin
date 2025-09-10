"use client";
import Notification from "@/components/notification";
import PageLayout from "@/components/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchAll } from "@/hooks/useData";
import { useStore } from "@/providers/datastore";
import NotificationQuery from "@/queries/notification";
import OrderQuery from "@/queries/order";
import PaymentQuery from "@/queries/payment";
import ProductQuery from "@/queries/product";
import ShopQuery from "@/queries/shop";
import StockQuery from "@/queries/stock";
import {
  NotificationT,
  Order,
  Payment,
  Product,
  Shop,
  Stock,
} from "@/types/types";
import { useEffect, useMemo, useState } from "react";

function Page() {
  const notificationsQuery = new NotificationQuery();
  const orderQuery = new OrderQuery();
  const paymentQuery = new PaymentQuery();
  const stockQuery = new StockQuery();
  const productQuery = new ProductQuery();
  const shopQuery = new ShopQuery();

  const getNotifications = fetchAll(notificationsQuery.getAll, "notifications");
  const getOrders = fetchAll(orderQuery.getAll, "orders");
  const getPayments = fetchAll(paymentQuery.getAll, "payments");
  const getStocks = fetchAll(stockQuery.getAll, "stocks");
  const getProducts = fetchAll(productQuery.getAll, "products");
  const getShops = fetchAll(shopQuery.getAll, "shops");

  const [notifications, setNotifications] = useState<NotificationT[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const { setLoading } = useStore();

  useEffect(() => {
    setLoading(
      getNotifications.isLoading ||
        getOrders.isLoading ||
        getPayments.isLoading ||
        getStocks.isLoading ||
        getProducts.isLoading ||
        getShops.isLoading
    );
    if (getNotifications.isSuccess) setNotifications(getNotifications.data);
    if (getOrders.isSuccess) setOrders(getOrders.data);
    if (getPayments.isSuccess) setPayments(getPayments.data);
    if (getStocks.isSuccess) setStocks(getStocks.data);
    if (getProducts.isSuccess) setProducts(getProducts.data);
    if (getShops.isSuccess) setShops(getShops.data);
  }, [
    setLoading,
    setNotifications,
    getNotifications.isLoading,
    getNotifications.isSuccess,
    getNotifications.data,
    setOrders,
    getOrders.isLoading,
    getOrders.isSuccess,
    getOrders.data,
    setPayments,
    getPayments.isLoading,
    getPayments.isSuccess,
    getPayments.data,
    setStocks,
    getStocks.isLoading,
    getStocks.isSuccess,
    getStocks.data,
    setProducts,
    getProducts.isLoading,
    getProducts.isSuccess,
    getProducts.data,
    setShops,
    getShops.isLoading,
    getShops.isSuccess,
    getShops.data,
  ]);

  const filteredNotifications = useMemo(() => {
    if (filter === "all") {
      return notifications;
    }
    return notifications.filter((item) => item.type === filter);
  }, [filter, notifications]);

  const types:NotificationT["type"][] = ["ORDER", "PAYMENT", "STOCK"];
  const getTypeName = (type:NotificationT["type"]):string => {
    switch(type){
      case "ORDER":
        return "Commande";
      case "PAYMENT":
        return "Paiement";
      case "STOCK":
        return "Etat des stocks (inventaire)"
    }
  }

  return (
    <PageLayout
      isLoading={
        getNotifications.isLoading ||
        getOrders.isLoading ||
        getPayments.isLoading ||
        getStocks.isLoading ||
        getProducts.isLoading ||
        getShops.isLoading
      }
      className="flex-1 overflow-auto p-4 space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>{"Filtrer par type"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Select defaultValue={filter} onValueChange={setFilter}>
            <SelectTrigger className="min-w-2xs w-full max-w-sm">
              <SelectValue placeholder="Sélectionner un type"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{"Tous"}</SelectItem>
              {types.map((type, id)=>(
                <SelectItem key={id} value={type}>{getTypeName(type)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{`Notifications (${filteredNotifications.length})`}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {filteredNotifications.length === 0 ? (
              <div className="py-5 flex flex-col items-center justify-center text-center gap-3 md:gap-5 text-sm sm:text-base lg:text-lg text-muted-foreground">
                <img
                  src="/images/notification-bell.png"
                  alt="notification"
                  className="h-14 w-auto lg:h-20 opacity-50"
                />
                {"Aucune notification."}
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <Notification
                  key={item.id}
                  {...item}
                  payments={payments}
                  orders={orders}
                  stocks={stocks}
                  shops={shops}
                  products={products}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}

export default Page;
