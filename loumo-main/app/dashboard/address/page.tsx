"use client";

import PageLayout from "@/components/page-layout";
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
import { useStore } from "@/providers/datastore";
import AddressQuery from "@/queries/address";
import ZoneQuery from "@/queries/zone";
import { Address, Zone } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import {
  CirclePlus,
  Edit,
  Eye,
  MapPin,
  MoreHorizontal,
  Search,
  Store,
  Trash2,
} from "lucide-react";
import React from "react";
import DeleteAddress from "./delete";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EditAddress from "./edit";
import AddAddress from "./add";

export default function ZonesPage() {
  const zonesQuery = new ZoneQuery();
  const getZones = useQuery({
    queryKey: ["zones"],
    queryFn: () => zonesQuery.getAll(),
    refetchOnWindowFocus: false,
  });

  const addressQuery = new AddressQuery();
  const getAddresses = useQuery({
    queryKey: ["addresses"],
    queryFn: () => addressQuery.getAll(),
    refetchOnWindowFocus: false,
  });

  const { setLoading } = useStore();

  const [zones, setZones] = React.useState<Zone[]>([]);
  const [addresses, setAddresses] = React.useState<Address[]>([]);

  const [addDialog, setAddDialog] = React.useState<boolean>(false);
  const [deleteDialog, setDeleteDialog] = React.useState<boolean>(false);
  const [editDialog, setEditDialog] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<Address>();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [zoneFilter, setZoneFilter] = React.useState("all");

  React.useEffect(() => {
    setLoading(getZones.isLoading || getAddresses.isLoading);
    if (getZones.isSuccess) setZones(getZones.data);
    if (getAddresses.isSuccess) setAddresses(getAddresses.data);
  }, [
    getZones.isSuccess,
    getZones.isLoading,
    getAddresses.isSuccess,
    getAddresses.isLoading,
  ]);

  const handleDelete = (address: Address) => {
    setSelected(address);
    setDeleteDialog(true);
  };

  const handleEdit = (address: Address) => {
    setSelected(address);
    setEditDialog(true);
  }

  const filteredAddresses = React.useMemo(() => {
    return addresses.filter((address) => {
      const matchesSearch =
        address.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.zone?.name.includes(searchTerm.toLowerCase());

      const matchesZone =
        zoneFilter === "all" || address.zoneId === Number(zoneFilter);

      return matchesSearch && matchesZone;
    });
  }, [addresses, searchTerm, zoneFilter]);

  return (
    <PageLayout
      isLoading={getZones.isLoading || getAddresses.isLoading}
      className="flex-1 p-4 space-y-6"
    >
      {/* Zone Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{"Quartiers"}</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{addresses.length}</div>
            <p className="text-xs text-muted-foreground">
              {`Dans ${
                zones.filter((x) => x.addresses.length > 0).length
              } zone(s)`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Quartiers inutilisés"}
            </CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {addresses.filter((x) => !x.zoneId).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{"Filtres"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <div className="relative xl:col-span-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par client ou numéro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={zoneFilter} onValueChange={setZoneFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Zone de livraison" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{"Toutes les zones"}</SelectItem>
                {zones.map((x) => (
                  <SelectItem key={x.id} value={String(x.id)}>
                    {x.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Zones Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between gap-4 flex-wrap items-center">
            <div className="grid gap-1">
              <CardTitle>{`Quartiers (${filteredAddresses.length})`}</CardTitle>
              <CardDescription>
                {"Configuration des zones et tarifs de livraison"}
              </CardDescription>
            </div>
            <Button onClick={() => setAddDialog(true)}>
              <CirclePlus size={16} /> {"Ajouter un quartier"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{"Quartier"}</TableHead>
                <TableHead>{"Zone affectée"}</TableHead>
                <TableHead>{"Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAddresses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-gray-500 py-5 sm:text-lg xl:text-xl"
                  >
                    {"Aucun quartier enregistré"}
                    <img
                      src={"/images/search.png"}
                      alt="no-image"
                      className="w-1/3 max-w-32 h-auto mx-auto mt-5 opacity-20"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                filteredAddresses.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.street}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {zones.find((el) =>
                        el.addresses.some((z) => z.id === item.id)
                      )?.name ?? "--"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant={"ghost"} size={"icon"}>
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Eye size={16} />
                            {"Voir les détails"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={()=>handleEdit(item)}>
                            <Edit size={16} />
                            {"Modifier"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => handleDelete(item)}
                          >
                            <Trash2 size={16} />
                            {"Supprimer"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selected && (
        <DeleteAddress
          isOpen={deleteDialog}
          openChange={setDeleteDialog}
          address={selected}
        />
      )}
      {selected && <EditAddress zones={zones} address={selected} openChange={setEditDialog} isOpen={editDialog}/>}
      <AddAddress openChange={setAddDialog} isOpen={addDialog}/>
    </PageLayout>
  );
}
