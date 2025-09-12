"use client";

import PageLayout from "@/components/page-layout";
import StatCard from "@/components/statistic-Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchAll } from "@/hooks/useData";
import { XAF } from "@/lib/utils";
import { useStore } from "@/providers/datastore";
import AddressQuery from "@/queries/address";
import DeliveryQuery from "@/queries/delivery";
import OrderQuery from "@/queries/order";
import ShopQuery from "@/queries/shop";
import ZoneQuery from "@/queries/zone";
import { Address, Delivery, Order, Shop, statisticCard, Zone } from "@/types/types";
import { CirclePlus, Edit, Eye, MapPin, MapPinned, MoreHorizontal, Store, Trash2, Truck } from "lucide-react";
import React from "react";
import AddZone from "./add";
import DeleteZone from "./delete";
import EditZone from "./edit";
import ViewZoneDetails from "./viewDetails";

export default function ZonesPage() {
  const zonesQuery = new ZoneQuery();
  const getZones = fetchAll(zonesQuery.getAll,"zones");

  const deliveriesQuery = new DeliveryQuery();
  const getDeliveries = fetchAll(deliveriesQuery.getAll,"deliveries");

  const addressQuery = new AddressQuery();
  const getAddresses = fetchAll(addressQuery.getAll,"addresses");

  const shopQuery = new ShopQuery();
  const getShops = fetchAll(shopQuery.getAll,"shops");

  const ordersQuery = new OrderQuery();
  const getOrders = fetchAll(ordersQuery.getAll,"orders");

  const { setLoading } = useStore();

  const [zones, setZones] = React.useState<Zone[]>([]);
  const [deliveries, setDeliveries] = React.useState<Delivery[]>([]);
  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [shops, setShops] = React.useState<Shop[]>([]);
  const [orders, setOrders] = React.useState<Order[]>([]);

  const [addDialog, setAddDialog] = React.useState<boolean>(false);
  const [deleteDialog, setDeleteDialog] = React.useState<boolean>(false);
  const [editDialog, setEditDialog] = React.useState<boolean>(false);
  const [viewDialog, setViewDialog] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<Zone>();

  React.useEffect(() => {
    setLoading(
      getZones.isLoading ||
        getDeliveries.isLoading ||
        getAddresses.isLoading ||
        getShops.isLoading ||
        getOrders.isLoading
    );
    if (getZones.isSuccess) setZones(getZones.data);
    if (getDeliveries.isSuccess) setDeliveries(getDeliveries.data);
    if (getAddresses.isSuccess) setAddresses(getAddresses.data);
    if (getShops.isSuccess) setShops(getShops.data);
    if (getOrders.isSuccess) setOrders(getOrders.data);
  }, [
    setLoading,
    getZones.isSuccess,
    getZones.data,
    getZones.isLoading,
    getDeliveries.isSuccess,
    getDeliveries.data,
    getDeliveries.isLoading,
    getAddresses.isSuccess,
    getAddresses.data,
    getAddresses.isLoading,
    getShops.isSuccess,
    getShops.data,
    getShops.isLoading,
    getOrders.isLoading,
    getOrders.isSuccess,
    getOrders.data,
  ]);

  const getMonthlyDeliveries = ({
    deliveries,
    monthOffset = 0,
  }: {
    deliveries: Delivery[];
    monthOffset?: number;
  }): Delivery[] => {
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);

    return deliveries.filter((delivery) => {
      const date = new Date(delivery.scheduledTime);
      return (
        date.getMonth() === target.getMonth() &&
        date.getFullYear() === target.getFullYear()
      );
    });
  };

  const handleDelete = (zone: Zone) => {
    setSelected(zone);
    setDeleteDialog(true);
  }

  const handleEdit = (zone: Zone) => {
    setSelected(zone);
    setEditDialog(true);
  }

  const handleView = (zone: Zone) => {
    setSelected(zone);
    setViewDialog(true);
  }

  const zoneStats:statisticCard[] = [
    {
      title: "Zones actives",
      icon: <MapPin size={16} className="text-primary"/>,
      value: zones.filter(zone=>!!zone.status).length,
      sub: {
        title: "Total zones",
        value: zones.length
      }
    },
    {
      title: "Quartiers associés",
      icon: <MapPinned size={16} className="text-ternary"/>,
      value: zones.reduce((total, item)=>total + item.addresses.length, 0),
      sub: {
        title: "Dans les zones actives",
        value: zones.filter(x=>!!x.status).reduce((total, item)=>total + item.addresses.length, 0)
      }
    },
    {
      title: "Livraisons du mois",
      value: getMonthlyDeliveries({ deliveries }).length,
      icon: <Truck size={16} className="text-secondary"/>
    }
  ];

  return (
    <PageLayout
      isLoading={
        getDeliveries.isLoading ||
        getZones.isLoading ||
        getAddresses.isLoading ||
        getShops.isLoading ||
        getOrders.isLoading
      }
      className="flex-1 p-4 space-y-6"
    >
      {/* Zone Stats */}
      <div className="grid gap-4 grid-cols-1 @min-[540px]:grid-cols-2 @min-[860px]:grid-cols-3 @min-[1156px]:grid-cols-4">
        {zoneStats.map((item, id)=><StatCard key={id} {...item} />)}
      </div>

      {/* Zones Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between gap-4 flex-wrap items-center">
            <div className="grid gap-1">
            <CardTitle>{"Zones de livraison"}</CardTitle>
            <CardDescription>
              {"Configuration des zones et tarifs de livraison"}
            </CardDescription>
            </div>
            <Button onClick={()=>setAddDialog(true)}><CirclePlus size={16}/> {"Ajouter une zone"}</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{"Zone"}</TableHead>
                <TableHead>{"Quartiers"}</TableHead>
                <TableHead>{"Boutique(s)"}</TableHead>
                <TableHead>{"Frais de livraison"}</TableHead>
                <TableHead>{"Commandes"}</TableHead>
                <TableHead>{"Statut"}</TableHead>
                <TableHead>{"Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {zones.map((zone) => (
                <TableRow key={zone.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{zone.name}</p>
{/*                       <p className="text-sm text-muted-foreground">
                        {zone.description}
                      </p> */}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {zone.addresses.slice(0,2).map((neighborhood, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="mr-1 mb-1"
                        >
                          {neighborhood.street}
                        </Badge>
                      ))}
                      {zone.addresses.length > 2 && 
                      <Badge variant={"outline"}>{`+${zone.addresses.length - 2} autres`}</Badge>
                      }
                      {zone.addresses.length === 0 && 
                      <p>{"Aucune adresse renseignée"}</p>
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {shops
                        .filter((x) =>
                          zone.addresses.some((y) => y.id === x.addressId)
                        )
                        .map((store, index) => (
                          <div key={index} className="flex items-center gap-1">
                            <Store className="h-3 w-3" />
                            <span className="text-sm">{store.name}</span>
                          </div>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{XAF.format(zone.price)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{orders.filter(x=> zone.addresses.some(y=>y.id === x.addressId)).length}</div>
                    {/* <div className="text-xs text-muted-foreground">ce mois</div> */}
                  </TableCell>
                  <TableCell>
                    <Badge>{zone.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"} size={"icon"}>
                          <MoreHorizontal size={16}/>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={()=>handleView(zone)}>
                          <Eye size={16} />
                          {"Voir les détails"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={()=>handleEdit(zone)}>
                          <Edit size={16} />
                          {"Modifier"}
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={()=>handleDelete(zone)}>
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

      {/* Zone Coverage Map Placeholder */}
      {/* <Card>
          <CardHeader>
            <CardTitle>Couverture géographique</CardTitle>
            <CardDescription>Visualisation des zones de livraison sur la carte</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Carte des zones de livraison</p>
                <p className="text-sm text-muted-foreground">Intégration carte à venir</p>
              </div>
            </div>
          </CardContent>
        </Card> */}
        <AddZone isOpen={addDialog} openChange={setAddDialog}/>
        {selected && <DeleteZone zone={selected} isOpen={deleteDialog} openChange={setDeleteDialog}/>}
        {selected && <EditZone zone={selected} isOpen={editDialog} openChange={setEditDialog} addresses={addresses}/>}
        {selected && <ViewZoneDetails isOpen={viewDialog} openChange={setViewDialog} zone={selected}/>}
    </PageLayout>
  );
}
