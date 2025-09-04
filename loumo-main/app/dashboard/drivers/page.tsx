"use client";
import PageLayout from "@/components/page-layout";
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
import { Agent, Delivery, Order, User } from "@/types/types";
import { isSameDay } from "date-fns";
import {
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

  const [agents, setAgents] = React.useState<Agent[]>([]);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [deliveries, setDeliveries] = React.useState<Delivery[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);
  const [addDialog, setAddDialog] = React.useState(false);
  const [selected, setSelected] = React.useState<Agent>();
  const [editDialog, setEditDialog] = React.useState(false);
  const [deleteDialog, setDeleteDialog] = React.useState(false);
  const [assignDialog, setAssignDialog] = React.useState(false);
  const { setLoading } = useStore();

  React.useEffect(() => {
    setLoading(getAgents.isLoading || getDeliveries.isLoading || getUsers.isLoading || getOrders.isLoading);
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
    setUsers,
    setDeliveries,
    setAgents,
    setOrders,
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

  return (
    <PageLayout
      className="flex-1 overflow-auto p-4 space-y-6"
      isLoading={
        getAgents.isLoading || getUsers.isLoading || getDeliveries.isLoading
      }
    >
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{"En cours"}</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                deliveries.filter((x) =>
                  x.status.toLowerCase().includes("pending")
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {"Livraisons actives"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Livrées aujourd'hui"}
            </CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                deliveries.filter(
                  (x) => x.status === "COMPLETED" && !!x.deliveredTime
                ).length
              }
            </div>
            {/* <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8</span> vs hier
            </p> */}
          </CardContent>
        </Card>

        {/*         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps moyen</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42min</div>
            <p className="text-xs text-muted-foreground">{"Temps de livraison"}</p>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Livreurs actifs"}
            </CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agents.filter((x) => x.status !== "SUSPENDED").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {`Sur ${
                agents.filter((x) => x.status === "AVAILABLE").length
              } disponible(s)`}
            </p>
          </CardContent>
        </Card>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {agents.length === 0 ? (
              <div className="p-4 min-h-[10vh] flex flex-col text-muted-foreground italic">
                {"Aucun livreur trouvé"}
              </div>
            ) : (
              agents.map((driver) => (
                <Card key={driver.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-10 w-10">
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
                          users.find((x) => x.id === driver.userId)?.tel && (
                            <p className="text-sm text-muted-foreground">
                              {users.find((x) => x.id === driver.userId)?.tel}
                            </p>
                          )}
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
                        <div className="flex flex-row justify-between gap-2 text-sm">
                          <span>{"Zones:"}</span>
                          <div className="flex flex-wrap justify-end gap-1.5">
                            {driver.zone.map(el => (
                              <span key={el.id} className="text-xs px-2 py-1 rounded-sm bg-ternary/10 border border-ternary font-medium">{el.name}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span>{"Statut:"}</span>
                        <Badge
                          variant={driver.status ? "outline" : "destructive"}
                        >
                          {driver.status ? "Actif" : "Inactif"}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{"En cours:"}</span>
                        <span>{`${
                          driver.delivery?.filter((z) => !!z.deliveredTime)
                            .length ?? 0
                        } livraisons`}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{"Aujourd'hui:"}</span>
                        <span>{`${driver.delivery?.filter(x=>x.deliveredTime && isSameDay(new Date(x.deliveredTime), new Date())).length} livrée(s)`}</span>
                      </div>
                      {/* <div className="flex justify-between text-sm">
                      <span>Note:</span>
                      <span>{driver.rating}/5 ⭐</span>
                    </div> */}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <a
                        href={
                          users.find((x) => x.id === driver.userId)?.tel
                            ? `tel:${
                                users.find((x) => x.id === driver.userId)?.tel
                              }`
                            : "#"
                        }
                      >
                        <Button
                          variant="outline"
                          className="flex-1"
                          disabled={
                            !users.find((x) => x.id === driver.userId)?.tel
                          }
                        >
                          <Phone size={16} />
                          {"Appeler"}
                        </Button>
                      </a>
                      <Button variant="default" className="flex-1" onClick={()=>handleAssign(driver)}>
                        {"Assigner"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      <AddDriver openChange={setAddDialog} isOpen={addDialog} />
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
        <AssignToDriver driver={selected} isOpen={assignDialog} openChange={setAssignDialog} orders={orders}/>
      )}
    </PageLayout>
  );
}

export default Page;
