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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchAll } from "@/hooks/useData";
import { XAF } from "@/lib/utils";
import { useStore } from "@/providers/datastore";
import OrderQuery from "@/queries/order";
import ShopQuery from "@/queries/shop";
import ZoneQuery from "@/queries/zone";
import { Order, Shop, Zone } from "@/types/types";
import {
  CirclePlus,
  Edit,
  Eye,
  MapPin,
  MoreHorizontal,
  Package,
  Store,
  Trash2
} from "lucide-react";
import React, { useState } from "react";
import DeleteStore from "./delete";
import EditStore from "./edit";
import NewStore from "./newStore";
import ViewStore from "./view";

export default function StoresPage() {
  const shopQuery = new ShopQuery();
  const getShops = fetchAll(shopQuery.getAll, "shops", 60000);

  const orderQuery = new OrderQuery();
  const getOrders = fetchAll(orderQuery.getAll, "orders", 60000);

  const zonesQuery = new ZoneQuery();
  const getZones = fetchAll(zonesQuery.getAll, "zones", 60000);

  const [shops, setShops] = useState<Shop[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const { setLoading } = useStore();

  const [selectedStore, setSelectedStore] = useState<Shop>();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const [editDialog, setEditDialog] = useState<boolean>(false);
  const [viewDialog, setViewDialog] = useState<boolean>(false);

  React.useEffect(() => {
    setLoading(getShops.isLoading || getOrders.isLoading || getZones.isLoading);
    if (getShops.isSuccess) {
      setShops(getShops.data);
    }
    if (getOrders.isSuccess) {
      setOrders(getOrders.data);
    }
    if (getZones.isSuccess) {
      setZones(getZones.data);
    }
  }, [
    setLoading,
    getShops.isLoading,
    getShops.isSuccess,
    getShops.data,
    getOrders.isLoading,
    getOrders.isSuccess,
    getOrders.data,
    getZones.isLoading,
    getZones.isSuccess,
    getZones.data,
  ]);

  //console.log(addresses);
  //console.log(shops)


  type monthlyRevenueProps = {
    orders: Order[];
    addressId?: number;
    monthOffset?: number;
  }

  const getMonthlyRevenue = ({orders, addressId, monthOffset = 0}:monthlyRevenueProps):number =>{
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);

  return orders
    .filter((order) => {
      const date = new Date(order.createdAt);
      if(!!addressId){
        return (
          order.addressId === addressId &&
          date.getMonth() === target.getMonth() &&
          date.getFullYear() === target.getFullYear()
        );
      }
      return (
          date.getMonth() === target.getMonth() &&
          date.getFullYear() === target.getFullYear()
        );
    })
    .reduce((total, order) => total + order.total, 0);
}

  return (
    <PageLayout
      isLoading={getShops.isLoading || getOrders.isLoading || getZones.isLoading}
      className="flex-1 space-y-4 p-4"
    >
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <Button onClick={()=>{setIsDialogOpen(true)}}><CirclePlus size={16}/>{"Nouveau point de vente"}</Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{"Vue d'ensemble"}</TabsTrigger>
          <TabsTrigger value="performance">{"Performance"}</TabsTrigger>
          <TabsTrigger value="coverage">{"Zones de couverture"}</TabsTrigger>
          {/* <TabsTrigger value="inventory">{"Stock par boutique"}</TabsTrigger> */}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {"Total Boutiques"}
                </CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{shops.length}</div>
              </CardContent>
            </Card>
            {/*             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Employés</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">35</div>
                <p className="text-xs text-muted-foreground">Moyenne: 11.7 par boutique</p>
              </CardContent>
            </Card> */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {"Chiffre d'Affaires"}
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{XAF.format(orders.filter(x=> !!x.payment).reduce((total, item)=>total + item.total,0))}</div>
                {
                  getMonthlyRevenue({orders:orders, monthOffset:-1}) !== 0 && 
                  <p className={`text-xs ${(getMonthlyRevenue({orders:orders})-getMonthlyRevenue({orders:orders, monthOffset:-1}))> 0 ? "text-green-700" : "text-destructive"}`}>
                  {`${((getMonthlyRevenue({orders:orders})-getMonthlyRevenue({orders:orders, monthOffset:-1}))/getMonthlyRevenue({orders:orders, monthOffset:-1}))*100}
                   vs mois dernier`}
                </p>}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{"Liste des Boutiques"}</CardTitle>
              <CardDescription>
                {"Gérez vos boutiques et leurs informations"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{"Boutique"}</TableHead>
                    <TableHead>{"Statut"}</TableHead>
                    <TableHead>{"CA Mensuel"}</TableHead>
                    <TableHead className="text-right">{"Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shops.map((store) => (
                    <TableRow key={store.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{store.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <MapPin className="mr-1 h-3 w-3" />
                            {zones.find(x=>x.addresses.some(y=>y.id === store.addressId))?.name ?? "Non défini"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={"info"}>{"Actif"}</Badge>
                      </TableCell>
                      <TableCell>
                        {store.addressId ? XAF.format(getMonthlyRevenue({orders:orders, addressId:store.addressId})) : "--"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{"Actions"}</DropdownMenuLabel>
                            <DropdownMenuItem onClick={()=>{setSelectedStore(store);setViewDialog(true)}}>
                              <Eye size={16} />
                              {"Voir détails"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={()=>{setSelectedStore(store);setEditDialog(true);}}>
                              <Edit size={16} />
                              {"Modifier"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={()=>{setSelectedStore(store);setDeleteDialog(true)}}>
                              <Trash2 size={16} />
                              {"Supprimer"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 min-[1700px]:grid-cols-4">
            {shops.map((store) => (
              <Card key={store.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{store.name}</CardTitle>
                  <CardDescription>{"Performance mensuelle"}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{"Chiffre d'affaires"}</span>
                    <span className="font-bold">
                      {!!store.addressId ? XAF.format(getMonthlyRevenue({orders:orders, addressId: store.addressId})) : "--"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{"Commandes"}</span>
                    <span className="font-bold">{orders.filter(x=>x.addressId === store.addressId).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{"Panier moyen"}</span>
                    <span className="font-bold">
                      {XAF.format(Math.round((orders.filter(x=>x.addressId === store.addressId).reduce((total, el)=>total + el.total, 0))/orders.filter(x=>x.addressId === store.addressId).length))}
                    </span>
                  </div>
{/*                   <div className="flex justify-between items-center">
                    <span className="text-sm">Employés</span>
                    <span className="font-bold">{store.employees}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">CA par employé</span>
                    <span className="font-bold">
                      {Math.round(
                        store.monthlyRevenue / store.employees
                      ).toLocaleString()}{" "}
                      MAD
                    </span>
                  </div> */}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="coverage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{"Zones de Couverture"}</CardTitle>
              <CardDescription>
                {"Zones desservies par chaque boutique"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {shops.map((store) => (
                  <div key={store.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{store.name}</h3>
                      {/* <Badge className={getStatusColor(store.status)}>
                        {store.status === "active"
                          ? "Actif"
                          : store.status === "maintenance"
                          ? "Maintenance"
                          : "Fermé"}
                      </Badge> */}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">{"Adresse:"}</span>
                        {store.address?.street && <p>{store.address?.street}</p>}
                        {store.address?.zone?.name && <p className="font-semibold">{store.address?.zone.name}</p>}
                      </div>
{/*                       <div>
                        <span className="text-muted-foreground">Horaires:</span>
                        <p className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {store.openingHours}
                        </p>
                      </div> */}
                    </div>
                    <div className="mt-3">
                      <span className="text-muted-foreground text-sm">
                        {"Zone desservie:"}
                      </span>
                        {zones.filter(x=>x.id === store.address?.zoneId).map((zone) => (
                      <div key={zone.id} className="flex flex-col gap-3">
                        <span className="font-semibold">{zone.name}</span>
                        <div className="flex flex-wrap gap-2">
                          {(!!zone.addresses && zone.addresses.length > 0) && 
                          zone.addresses.map(y=>
                            <Badge key={y.id} variant={"outline"}>
                              {y.street ?? y.local}
                            </Badge>
                          )}
                        </div>
                      </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock par Boutique</CardTitle>
              <CardDescription>
                Niveaux de stock dans chaque boutique
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Rechercher un produit..."
                    className="max-w-sm"
                  />
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Toutes les boutiques" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les boutiques</SelectItem>
                      {stores.map((store) => (
                        <SelectItem key={store.id} value={store.id.toString()}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produit</TableHead>
                      <TableHead>Centre-Ville</TableHead>
                      <TableHead>Ain Sebaa</TableHead>
                      <TableHead>Hay Riad</TableHead>
                      <TableHead>Stock Total</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Riz Basmati 5kg</div>
                        <div className="text-sm text-muted-foreground">
                          SKU: RIZ-BAS-5KG
                        </div>
                      </TableCell>
                      <TableCell>45</TableCell>
                      <TableCell>23</TableCell>
                      <TableCell>67</TableCell>
                      <TableCell className="font-medium">135</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          En stock
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Huile d'olive 1L</div>
                        <div className="text-sm text-muted-foreground">
                          SKU: HUILE-OLI-1L
                        </div>
                      </TableCell>
                      <TableCell>12</TableCell>
                      <TableCell>8</TableCell>
                      <TableCell>15</TableCell>
                      <TableCell className="font-medium">35</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Stock faible
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Pâtes Spaghetti 500g</div>
                        <div className="text-sm text-muted-foreground">
                          SKU: PAT-SPA-500G
                        </div>
                      </TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>5</TableCell>
                      <TableCell>12</TableCell>
                      <TableCell className="font-medium">17</TableCell>
                      <TableCell>
                        <Badge className="bg-red-100 text-red-800">
                          Rupture partielle
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
      <NewStore isOpen={isDialogOpen} openChange={setIsDialogOpen} zones={zones}/>
      {selectedStore && <DeleteStore isOpen={deleteDialog} openChange={setDeleteDialog} store={selectedStore}/>}
      {selectedStore && <EditStore isOpen={editDialog} openChange={setEditDialog} store={selectedStore} zones={zones}/>}
      {selectedStore && 
        <ViewStore 
        isOpen={viewDialog} 
        openChange={setViewDialog} 
        store={selectedStore} 
        CA={getMonthlyRevenue({orders:orders, addressId: selectedStore.addressId ?? undefined})} 
        totalOrders={orders.filter(x=>x.addressId === selectedStore.addressId).length}
        zones={zones} />
      }
    </PageLayout>
  );
}
