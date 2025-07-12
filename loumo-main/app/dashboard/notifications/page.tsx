'use client'
import PageLayout from '@/components/page-layout'
import { cn } from '@/lib/utils';
import { useStore } from '@/providers/datastore';
import NotificationQuery from '@/queries/notification';
import { NotificationT } from '@/types/types'
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Bell, User } from 'lucide-react';
import React, { useEffect, useState } from 'react'

function Page() {

  const notificationsQuery = new NotificationQuery();

  const getNotifications = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationsQuery.getAll(),
  });

  const [notifications, setNotifications] = useState<NotificationT[]>([]);
  const { setLoading } = useStore();

  useEffect(()=>{
    setLoading(getNotifications.isLoading);
    if(getNotifications.isSuccess)setNotifications(getNotifications.data);
  },[
    setLoading,
    setNotifications,
    getNotifications.isLoading,
    getNotifications.isSuccess,
    getNotifications.data
  ]);

  return (
    <PageLayout isLoading={getNotifications.isLoading} className='flex-1 overflow-auto p-4 space-y-6'>
       <div className="space-y-4">
        {notifications.length === 0 && (
          <div className="py-5 text-sm sm:text-base lg:text-lg text-muted-foreground">
            {"Aucune notification disponible."}
          </div>
        )}

        {notifications.map((item) => (
          <div
            key={item.id}
            className={cn(
              "p-4 rounded-md border shadow-sm",
              "hover:shadow-md transition-all bg-white"
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 font-medium text-sm">
                <Bell size={16} />
                {item.action}
              </div>
              <div className="text-xs text-muted-foreground">
                {format(new Date(item.createdAt), "PPPpp", { locale: fr })}
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-2">{item.description}</p>
            {item.user && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User size={14} />
                {item.user.name || item.user.email}
              </div>
            )}
          </div>
        ))}
      </div>
    </PageLayout>
  )
}

export default Page