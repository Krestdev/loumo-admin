'use client'
import PageLayout from '@/components/page-layout';
import { fetchAll } from '@/hooks/useData';
import { cn } from '@/lib/utils';
import { useStore } from '@/providers/datastore';
import NotificationQuery from '@/queries/notification';
import UserQuery from '@/queries/user';
import { NotificationT, User } from '@/types/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Bell, User2} from 'lucide-react';
import { useEffect, useState } from 'react';

function Page() {

  const notificationsQuery = new NotificationQuery();
  const userQuery = new UserQuery();

  const getNotifications = fetchAll(notificationsQuery.getAll, "notifications");
  const getUsers = fetchAll(userQuery.getAll, "users");

  const [notifications, setNotifications] = useState<NotificationT[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const { setLoading } = useStore();

  useEffect(()=>{
    setLoading(getNotifications.isLoading || getUsers.isLoading);
    if(getNotifications.isSuccess)setNotifications(getNotifications.data);
    if(getUsers.isSuccess)setUsers(getUsers.data);
  },[
    setLoading,
    setNotifications,
    getNotifications.isLoading,
    getNotifications.isSuccess,
    getNotifications.data,
    setUsers,
    getUsers.isLoading,
    getUsers.isSuccess,
    getUsers.data
  ]);

  return (
    <PageLayout isLoading={getNotifications.isLoading || getUsers.isLoading} className='flex-1 overflow-auto p-4 space-y-6'>
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
            {item.userId && users.find(x=> x.id === item.userId) && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User2 size={14} />
                {users.find(x=> x.id === item.userId)?.name || users.find(x=> x.id === item.userId)?.email}
              </div>
            )}
          </div>
        ))}
      </div>
    </PageLayout>
  )
}

export default Page