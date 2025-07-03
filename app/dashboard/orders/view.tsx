"use client";
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
import { XAF } from "@/lib/utils";
import ProductVariantQuery from "@/queries/productVariant";
import { Order, Zone } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  CheckCircle,
  CreditCard,
  Download,
  MapPin,
  Package,
  User,
} from "lucide-react";
import React from "react";

type Props = {
  order: Order;
  zones: Zone[];
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
};

function ViewOrder({ order, isOpen, openChange, zones }: Props) {
  const variantQuery = new ProductVariantQuery();
  const getVariants = useQuery({
    queryKey: ["variants"],
    queryFn: () => variantQuery.getAll(),
    refetchOnWindowFocus: false,
  });
  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {`Détails de la commande de ${order.user.name}`}
          </DialogTitle>
          <DialogDescription>
            {`Du ${format(order.createdAt, "dd/MM - HH:mm")}`}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {"Informations client"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {order.user.name && (
                <p>
                  <strong>{"Nom:"}</strong> {order.user.name}
                </p>
              )}
              {order.user.email && (
                <p>
                  <strong>{"Email:"}</strong> {order.user.email}
                </p>
              )}
              {order.user.tel && (
                <p>
                  <strong>{"Téléphone:"}</strong> {order.user.tel}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Delivery Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {"Livraison"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <strong>{"Zone:"}</strong>{" "}
                {zones.find((x) => x.id === order.address?.id)?.name}
              </p>
              {order.address && (
                <p>
                  <strong>{"Adresse:"}</strong> {order.address?.street}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                {"Produits commandés"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getVariants.isSuccess && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{"Produit"}</TableHead>
                      <TableHead>{"Quantité"}</TableHead>
                      <TableHead>{"Prix unitaire"}</TableHead>
                      <TableHead>{"Total"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.orderItems ? (
                      order.orderItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{`${
                            getVariants.data.find(
                              (x) => x.id === item.productVariantId
                            )?.name
                          }`}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            {XAF.format(
                              getVariants.data.find(
                                (x) => x.id === item.productVariantId
                              )?.price ?? 0
                            )}
                          </TableCell>
                          <TableCell>{XAF.format(item.total)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4}>
                          {"Aucun produit à afficher"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
              <div className="mt-4 space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span>{"Sous-total:"}</span>
                  <span>{XAF.format(order.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{"Frais de livraison:"}</span>
                  <span>{XAF.format(order.deliveryFee)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>{"Total:"}</span>
                  <span>{XAF.format(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                {"Informations de paiement"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div>
                <div className="flex gap-2 items-center">
                  <strong>{"Statut :"}</strong>
                    {!order.payment
                      ? <span className="text-destructive">{"Non Payé"}</span>
                      : order.payment.status === "ACCEPTED"
                      ? "Accepté"
                      : order.payment.status === "PENDING"
                      ? "En cours"
                      : order.payment.status === "COMPLETED"
                      ? <span className="inline-flex gap-1 items-center font-semibold">{"Payé"} <CheckCircle size={12} className="text-green-600" /></span>
                      : <span className="text-destructive">{"Non Payé"}</span>}
                </div>
                <p>
                  <strong>{"Montant :"}</strong> {XAF.format(order.total)}
                </p>
                <p>
                  <strong>{"Date de commande : "}</strong>
                  {format(order.createdAt, "dd/MM/yyyy - HH:mm")}
                </p>
              </div>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                {"Télécharger facture"}
              </Button>
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

export default ViewOrder;
