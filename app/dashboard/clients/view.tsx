import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { findLatestByDate, XAF } from "@/lib/utils";
import { Order, User } from "@/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { format, formatRelative } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Calendar,
  Mail,
  MapPin,
  Phone,
  ShoppingCart,
  Star,
  Users,
} from "lucide-react";
import React from "react";

type Props = {
  client: User;
  isOpen: boolean;
  orders: Order[];
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
};

function ViewClient({ client, isOpen, openChange, orders }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{`Profil client - ${client.name}`}</DialogTitle>
          <DialogDescription>
            {"Informations détaillées et historique du client"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {"Informations personnelles"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={client.imageUrl || "/placeholder.svg"} />
                  <AvatarFallback>
                    {client.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-lg">{client.name}</p>
                  <Badge variant={client.active ? "secondary" : "outline"}>
                    {client.active ? "Actif" : "Inactif"}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{client.email}</span>
                </div>
                {client.tel && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{client.tel}</span>
                  </div>
                )}
                {client.addresses && client.addresses.length > 0 && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{client.addresses[0].street}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {"Client depuis le"}{" "}
                    {format(client.createdAt, "dd/MM/yyyy")}
                  </span>
                </div>
              </div>
              {/* <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  {"Adresse complète:"}
                </p>
                <p>{client.address}</p>
              </div> */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                {"Statistiques"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">
                    {orders.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {"Commandes"}
                  </div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">
                    {XAF.format(
                      orders
                        .filter((x) => x.userId === client.id)
                        .reduce((total, el) => total + el.total, 0)
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {"Total dépensé"}
                  </div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    {client.fidelity}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {"Points fidélité"}
                  </div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">
                    {XAF.format(
                      orders
                        .filter((x) => x.userId === client.id)
                        .reduce((total, el) => total + el.total, 0) /
                        (orders.filter((x) => x.userId === client.id).length ||
                          1)
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {"Panier moyen"}
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  {"Dernière commande:"}
                </p>
                <p className="font-medium">
                  {
                    findLatestByDate(
                        orders.filter((x) => x.userId === client.id),
                        "createdAt"
                      )?.createdAt ?
                  formatRelative(
                    new Date(
                      findLatestByDate(
                        orders.filter((x) => x.userId === client.id),
                        "createdAt"
                      )?.createdAt ?? "2025-01-01"
                    ), // ✅ date réelle
                    new Date(), // maintenant
                    { locale: fr }
                  ) : <span className="italic !font-normal">{"Aucune commande enregistrée"}</span>}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{"Historique des commandes"}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{"Ref"}</TableHead>
                    <TableHead>{"Date"}</TableHead>
                    <TableHead>{"Montant"}</TableHead>
                    <TableHead>{"Statut"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length > 0 ? (
                    orders.slice(0, 4).map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.id}
                        </TableCell>
                        <TableCell>{format(order.createdAt, "dd/MM/yyyy - HH:mm", {locale: fr})}</TableCell>
                        <TableCell>{XAF.format(order.total)}</TableCell>
                        <TableCell>
                          <Badge variant={order.status === "ACCEPTED" ? "default" : order.status === "REJECTED" ? "destructive" : order.status === "PENDING" ? "secondary" : order.status === "COMPLETED" ? "default" : "outline" }>{order.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell className="text-muted-foreground italic">
                        {"Aucune commande"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant={"outline"} onClick={() => openChange(false)}>
            {"Fermer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ViewClient;
