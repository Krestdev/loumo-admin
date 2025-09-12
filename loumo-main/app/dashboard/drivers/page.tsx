"use client";
import PageLayout from "@/components/page-layout";
import StatCard from "@/components/statistic-Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAll } from "@/hooks/useData";
import { useStore } from "@/providers/datastore";
import AgentQuery from "@/queries/agent";
import DeliveryQuery from "@/queries/delivery";
import OrderQuery from "@/queries/order";
import UserQuery from "@/queries/user";
import ZoneQuery from "@/queries/zone";
import { Agent, AgentStatus, Delivery, Order, statisticCard, User, Zone } from "@/types/types";
import { isSameDay } from "date-fns";
import {
  Calendar1,
  Edit,
  Package,
  Phone,
  Plus,
  Trash2,
  Truck,
  UserIcon
} from "lucide-react";
import React from "react";
import AddDriver from "./add";
import AssignToDriver from "./assign";
import DeleteDriver from "./delete";
import EditDriver from "./edit";

function Page() {
  const agentQuery = new AgentQuery();
  const getAgents = fetchAll(agentQuery.getAll, "agents");

  const deliveryQuery = new DeliveryQuery();
  const getDeliveries = fetchAll(deliveryQuery.getAll, "deliveries");

  const userQuery = new UserQuery();
  const getUsers = fetchAll(userQuery.getAll, "users");

  const orderQuery = new OrderQuery();
  const getOrders = fetchAll(orderQuery.getAll, "orders");

  const zoneQuery = new ZoneQuery();
  const getZones = fetchAll(zoneQuery.getAll, "zones");

  const [agents, setAgents] = React.useState<Agent[]>([]);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [zones, setZones] = React.useState<Zone[]>([]);
  const [deliveries, setDeliveries] = React.useState<Delivery[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);
  const [addDialog, setAddDialog] = React.useState(false);
  const [selected, setSelected] = React.useState<Agent>();
  const [editDialog, setEditDialog] = React.useState(false);
  const [deleteDialog, setDeleteDialog] = React.useState(false);
  const [assignDialog, setAssignDialog] = React.useState(false);
  const { setLoading } = useStore();

  React.useEffect(() => {
    setLoading(getAgents.isLoading || getDeliveries.isLoading || getUsers.isLoading || getOrders.isLoading || getZones.isLoading);
    if (getAgents.isSuccess) {
      setAgents(getAgents.data);
    }
    if (getDeliveries.isSuccess) {
      setDeliveries(getDeliveries.data);
    }
    if (getUsers.isSuccess) {
      setUsers(getUsers.data);
    }
    if (getOrders.isSuccess) {
      setOrders(getOrders.data);
    }
    if (getZones.isSuccess) {
      setZones(getZones.data);
    }
  }, [
    setLoading,
    getAgents.data,
    getAgents.isSuccess,
    getAgents.isLoading,
    getDeliveries.data,
    getDeliveries.isSuccess,
    getDeliveries.isLoading,
    getUsers.data,
    getUsers.isSuccess,
    getUsers.isLoading,
    getOrders.data,
    getOrders.isSuccess,
    getOrders.isLoading,
    getZones.data,
    getZones.isSuccess,
    getZones.isLoading,
    setUsers,
    setDeliveries,
    setAgents,
    setOrders,
    setZones,
  ]);

  const handleEdit = (agent: Agent) => {
    setSelected(agent);
    setEditDialog(true);
  };
  const handleDelete = (agent: Agent) => {
    setSelected(agent);
    setDeleteDialog(true);
  };

  const handleAssign = (agent: Agent) => {
    setSelected(agent);
    setAssignDialog(true);
  }

  const agentStatusName = (status:AgentStatus) => {
    switch (status){
      case "AVAILABLE":
        return "Disponible";
      case "FULL":
        return "Occupé";
      case "SUSPENDED":
        return "Suspendu";
      case "UNAVAILABLE":
        return "Indisponible";
      case "UNVERIFIED":
        return "Non vérifié";
      default:
        return status;
    }
  }

  const statistics:statisticCard[] = [
    {
      title: "Livraison en cours",
      value: deliveries.filter((x)=>x.status.toLowerCase().includes("pending")).length,
      icon: <Truck className="h-4 w-4 text-green-700" />,
    },
    {
      title: "Livraisons terminées",
      value: deliveries.filter((x) => x.status === "COMPLETED" && !!x.deliveredTime).length,
      icon: <Package className="h-4 w-4 text-secondary" />,
    },
    {
      title: "Livreurs",
      value: agents.filter(agent=>agent.status==="AVAILABLE" || agent.status==="FULL").length,
      icon:<UserIcon className="h-4 w-4 text-muted-foreground" />,
      sub: {
        title: "Livreurs disponibles",
        value: agents.filter(agent=>agent.status==="AVAILABLE").length
      }
    }
  ];

  return (
    <PageLayout
      className="flex-1 overflow-auto p-4 space-y-6"
      isLoading={
        getAgents.isLoading || getUsers.isLoading || getDeliveries.isLoading
      }
    >
      <div className="grid gap-4 grid-cols-1 @min-[540px]:grid-cols-2 @min-[860px]:grid-cols-3">
        {statistics.map((item, id)=><StatCard key={id} {...item}/>)}
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{"Équipe de livraison"}</CardTitle>
          <Button onClick={() => setAddDialog(true)}>
            <Plus size={16} />
            {"Ajouter un livreur"}
          </Button>
        </CardHeader>
        <CardContent>
            <div className="grid gap-4 grid-cols-1 @min-[700px]/Main:grid-cols-2 @min-[1200px]/Main:grid-cols-3 @min-[1600px]/Main:grid-cols-4">
              {agents.length === 0 ? (
                <div className="p-4 min-h-[10vh] flex flex-col gap-3 md:gap-5">
                  <p className="text-muted-foreground italic">{"Aucun livreur trouvé"}</p>
                  <Button size={"lg"} onClick={() => setAddDialog(true)}>
                    {"Ajouter un Livreur"}
                  </Button>
                </div>
              ) : (
                agents.map((driver) => (
                  <Card key={driver.id}>
                    <CardContent className="p-4 @container flex flex-col gap-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-16 w-16">
                          <AvatarImage
                            src={
                              users.find((x) => x.id === driver.userId)
                                ?.imageUrl || "/placeholder.svg"
                            }
                          />
                          <AvatarFallback>
                            {users.find((x) => x.id === driver.userId)
                              ? users
                                  .find((x) => x.id === driver.userId)
                                  ?.name.split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : "DR"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          {users.find((x) => x.id === driver.userId) && (
                            <p className="font-medium">
                              {users.find((x) => x.id === driver.userId)?.name}
                            </p>
                          )}
                          {users.find((x) => x.id === driver.userId) &&
                              <p className="text-sm text-muted-foreground">
                                {users.find((x) => x.id === driver.userId)?.tel ?? "Aucun numéro"}
                              </p>
                            }
                            <Badge
                            variant={driver.status === "AVAILABLE" ? "default" : driver.status === "FULL" ? "warning" : "destructive"}
                          >
                            {agentStatusName(driver.status)}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size={"icon"}
                            onClick={() => handleEdit(driver)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="delete"
                            size={"icon"}
                            onClick={() => handleDelete(driver)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {driver.zone && (
                          <div className="flex flex-col justify-between gap-2 text-sm">
                            <span className="text-gray-500 text-xs uppercase">{"Zones"}</span>
                            <div className="flex flex-wrap justify-start gap-1.5">
                              {driver.zone.map(el => (
                                <span key={el.id} className="text-xs px-2.5 py-1.5 rounded-full border bg-gray-100 font-medium">{el.name}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className="text-gray-500 text-xs uppercase">{"Livraisons"}</span>
                          <div className="grid grid-cols-2 gap-0 divide-x">
                            <div className="grid p-3 bg-gray-100">
                              <span className="text-xs font-medium flex items-center gap-1"><span className="size-2 rounded-full bg-green-600" />{"En cours:"}</span>
                              <span className="flex items-center gap-1 text-sm"><Calendar1 size={16}/><strong>{
                                driver.delivery?.filter((z) => !!z.deliveredTime)
                                  .length ?? 0
                              }</strong>{"livraison(s)"}</span>
                            </div>
                            <div className="grid p-3 bg-gray-100">
                              <span className="text-xs font-medium flex items-center gap-1"><span className="size-2 rounded-full bg-purple-600" />{"Aujourd'hui:"}</span>
                              <span className="flex items-center gap-1 text-sm"><Truck size={16} /><strong>{driver.delivery?.filter(x=>x.deliveredTime && isSameDay(new Date(x.deliveredTime), new Date())).length}</strong>{"livrée(s)"}</span>
                            </div>
                          </div>
                          </div>
                      <div className="grid grid-cols-1 @min-[400px]:grid-cols-2 gap-2">
                        <Button variant="default" onClick={()=>handleAssign(driver)}>
                          {"Assigner"}
                        </Button>
                        <a
                        className="w-full"
                          href={
                            users.find((x) => x.id === driver.userId)?.tel
                              ? `tel:${
                                  users.find((x) => x.id === driver.userId)?.tel
                                }`
                              : "#"
                          }
                        >
                          <Button
                            variant="black"
                            disabled={
                              !users.find((x) => x.id === driver.userId)?.tel
                            }
                            className="w-full"
                          >
                            <Phone size={16} />
                            {"Appeler"}
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
        </CardContent>
      </Card>
      <AddDriver openChange={setAddDialog} isOpen={addDialog} zones={zones} users={users} agents={agents} />
      {selected && (
        <EditDriver
          isOpen={editDialog}
          openChange={setEditDialog}
          agent={selected}
        />
      )}
      {selected && (
        <DeleteDriver
          isOpen={deleteDialog}
          openChange={setDeleteDialog}
          agent={selected}
        />
      )}
      {selected && (
        <AssignToDriver 
        driver={selected} 
        isOpen={assignDialog} 
        openChange={setAssignDialog} 
        orders={orders}/>
      )}
    </PageLayout>
  );
}

export default Page;
