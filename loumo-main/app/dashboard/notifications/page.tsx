'use client'
import Notification from '@/components/notification';
import PageLayout from '@/components/page-layout';
import { fetchAll } from '@/hooks/useData';
import { useStore } from '@/providers/datastore';
import NotificationQuery from '@/queries/notification';
import OrderQuery from '@/queries/order';
import PaymentQuery from '@/queries/payment';
import StockQuery from '@/queries/stock';
import { NotificationT, Order, Payment, Stock } from '@/types/types';
import { useEffect, useState } from 'react';

function Page() {

  const notificationsQuery = new NotificationQuery();
  const orderQuery = new OrderQuery();
  const paymentQuery = new PaymentQuery();
  const stockQuery = new StockQuery();

  const getNotifications = fetchAll(notificationsQuery.getAll, "notifications");
  const getOrders = fetchAll(orderQuery.getAll, "orders");
  const getPayments = fetchAll(paymentQuery.getAll, "payments");
  const getStocks = fetchAll(stockQuery.getAll, "stocks");

  const [notifications, setNotifications] = useState<NotificationT[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const { setLoading } = useStore();

  useEffect(()=>{
    setLoading(getNotifications.isLoading || getOrders.isLoading || getPayments.isLoading || getStocks.isLoading);
    if(getNotifications.isSuccess)setNotifications(getNotifications.data);
    if(getOrders.isSuccess)setOrders(getOrders.data);
    if(getPayments.isSuccess)setPayments(getPayments.data);
    if(getStocks.isSuccess)setStocks(getStocks.data);
  },[
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
    getStocks.data
  ]);

  return (
    <PageLayout isLoading={getNotifications.isLoading || getOrders.isLoading || getPayments.isLoading || getStocks.isLoading} className='flex-1 overflow-auto p-4 space-y-6'>
       <div className="w-full max-w-3xl space-y-4">
        {notifications.length === 0 && (
          <div className="py-5 text-sm sm:text-base lg:text-lg text-muted-foreground">
            {"Aucune notification disponible."}
          </div>
        )}

        {notifications.map((item) => (
          <Notification key={item.id} {...item} payments={payments} orders={orders} stocks={stocks}/>
        ))}
      </div>
    </PageLayout>
  )
}

export default Page