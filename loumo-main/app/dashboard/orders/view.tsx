"use client";
import { OrderInvoice } from "@/components/orderPDFTemplate";
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
import { fetchAll } from "@/hooks/useData";
import { XAF } from "@/lib/utils";
import ProductVariantQuery from "@/queries/productVariant";
import { Delivery, Order, Product, ProductVariant, Zone } from "@/types/types";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { format } from "date-fns";
import {
  CheckCircle,
  CreditCard,
  Loader2,
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
  delivery?: Delivery;
  products: Product[];
};

function ViewOrder({ order, isOpen, openChange, zones, delivery, products }: Props) {
  const variantQuery = new ProductVariantQuery();
  const getVariants = fetchAll(variantQuery.getAll, "variants");
  const [variants, setVariants] = React.useState<ProductVariant[]>([]);

  React.useEffect(() => {
    if (getVariants.isSuccess) {
      setVariants(getVariants.data);
    }
  }, [setVariants, getVariants.isSuccess, getVariants.data]);

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
                <strong>{"Zone : "}</strong>
                {zones.find((x) => x.id === order.address?.id)?.name}
              </p>
              {order.address && (
                <p>
                  <strong>{"Adresse : "}</strong> {order.address?.street}
                </p>
              )}
              {delivery && <p>
                <span>{"Livreur : "}</span><strong>{delivery.agent?.user?.name ?? "--"}</strong>
                </p>}
            </CardContent>
          </Card>

          {/* Order Items */}
          {getVariants.isSuccess ? (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  {"Produits commandés"}
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                            products.find(y=> y.variants?.some(z=> z.id === item.productVariantId))?.variants?.find((x) => x.id === item.productVariantId)
                              ?.name
                          } ${
                            variants.find((x) => x.id === item.productVariantId)
                              ?.quantity
                          } ${
                            variants.find((x) => x.id === item.productVariantId)
                              ?.unit
                          } (${products.find(y=> y.variants?.some(z=> z.id === item.productVariantId)) ? products.find(y=> y.variants?.some(z=> z.id === item.productVariantId))?.name : "Non défini"})`}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            {XAF.format(
                              variants.find(
                                (x) => x.id === item.productVariantId
                              )?.price ?? 0
                            )}
                          </TableCell>
                          <TableCell>{XAF.format(
                              variants.find(
                                (x) => x.id === item.productVariantId
                              )?.price ?? 0
                              * item.quantity
                            )}</TableCell>
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
                    <span>{XAF.format(order.total + order.deliveryFee)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            getVariants.isLoading && (
              <div className="w-full h-12 flex items-center justify-center">
                <Loader2 size={20} className="animate-spin text-green-600" />
              </div>
            )
          )}

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
                  {!order.payment ? (
                    <span className="text-destructive">{"Non Payé"}</span>
                  ) : order.payment.status === "ACCEPTED" ? (
                    "Accepté"
                  ) : order.payment.status === "PENDING" ? (
                    "En cours"
                  ) : order.payment.status === "COMPLETED" ? (
                    <span className="inline-flex gap-1 items-center font-semibold">
                      {"Payé"}
                      <CheckCircle size={12} className="text-green-600" />
                    </span>
                  ) : (
                    <span className="text-destructive">{"Non Payé"}</span>
                  )}
                </div>
                <p>
                  <strong>{"Montant :"}</strong> {XAF.format(order.total)}
                </p>
                <p>
                  <strong>{"Date de commande : "}</strong>
                  {format(order.createdAt, "dd/MM/yyyy - HH:mm")}
                </p>
              </div>
              {getVariants.isSuccess && (
                <PDFDownloadLink
                  document={
                    <OrderInvoice
                      order={order}
                      variants={variants}
                      zones={zones}
                      logoUrl="/logo.png"
                    />
                  }
                  fileName={`facture-loumo-${order.id}.pdf`}
                >
                  {({ loading }) => (
                    <Button>
                      {loading ? "Génération..." : "Télécharger la facture"}
                    </Button>
                  )}
                </PDFDownloadLink>
              )}
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
