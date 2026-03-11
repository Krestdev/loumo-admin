import { notifyInfo } from "@/lib/notify";
import { cn, XAF } from "@/lib/utils";
import NotificationQuery from "@/queries/notification";
import { NotificationT, Order, Payment, Product, Shop, Stock } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cva, VariantProps } from "class-variance-authority";
import { formatRelative } from "date-fns";
import { fr } from "date-fns/locale";
import { DollarSign, Package, PackageX, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { Button } from "./ui/button";

const notificationVariants = cva(
  "w-full max-w-3xl flex flex-row gap-3 md:gap-4 xl:gap-5 rounded-lg p-3 bg-gradient-to-r to-white shadow-sm",
  {
    variants: {
      variant: {
        default: "from-gray-50 text-gray-800",
        success: "from-emerald-50 text-emerald-700",
        warning: "from-orange-50 text-orange-700",
        error: "from-red-50 text-red-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type Props = NotificationT & {
  orders: Order[];
  payments: Payment[];
  stocks: Stock[];
  shops: Shop[];
  products: Product[];
};

function Notification({
  id,
  createdAt,
  type,
  variant,
  orderId,
  stockId,
  paymentId,
  action,
  description,
  orders,
  stocks,
  payments,
  shops,
  products
}: Props) {

  const notificationQuery = new NotificationQuery();
  const queryClient = useQueryClient();
  const removeNotification = useMutation({
    mutationFn: (id:number)=> notificationQuery.delete(id),
    onSuccess: ()=>{
      queryClient.invalidateQueries({queryKey: ["notifications"], refetchType:"active"})
      notifyInfo("Notification supprimée !");
    }
  })
  const getVariantStyle = (
    variant: NotificationT["variant"]
  ): VariantProps<typeof notificationVariants>["variant"] => {
    switch (variant) {
      case "DANGER":
        return "error";
      case "SUCCESS":
        return "success";
      case "WARNING":
        return "warning";
      default:
        return "default";
    }
  };

  const getBadgeVariantStyle = (variant: NotificationT["variant"]) => {
    switch (variant) {
      case "DANGER":
        return "text-red-700";
      case "INFO":
        return "text-blue-700";
      case "SUCCESS":
        return "text-primary";
      case "WARNING":
        return "text-orange-200";
      default:
        return "text-gray-100";
    }
  };

  interface ObjectProps {
    title: string;
    description: string;
    date: Date;
    icon: ReactNode;
    url: string;
  }

  const getNotificationObject = (notification: NotificationT): ObjectProps => {
    const size:number = 32; //size for icons

    if (notification.type === "ORDER") {
      switch (notification.variant) {
        case "INFO":
          return {
            title: "Nouvelle commande !",
            description: orderId
              ? `${
                  orders.find((order) => order.id === notification.orderId)
                    ?.ref ?? "Référence de la commande"
                } de ${XAF.format(
                  orders.find((order) => order.id === notification.orderId)
                    ?.total ?? 0
                )} a été ajoutée `
              : "Consultez la liste des commandes",
            date: new Date(notification.createdAt),
            icon: <ShoppingCart size={size} />,
            url: "/orders",
          };
        default:
          return {
            title: "Commande",
            description: notification.description,
            date: new Date(notification.createdAt),
            icon: <ShoppingCart size={size} />,
            url: "/orders",
          };
      }
    } else if (notification.type === "PAYMENT") {
      switch (notification.variant) {
        case "SUCCESS":
          return {
            title: "Nouveau Paiement !",
            description: paymentId
              ? `${
                  payments.find((el) => el.id === notification.paymentId)
                    ?.ref ?? "Référence du paiement"
                } de ${XAF.format(
                  payments.find((x) => x.id === notification.paymentId)
                    ?.total ?? 0
                )} a été validé `
              : "Consultez la liste des paiements",
            date: new Date(notification.createdAt),
            icon: <DollarSign size={size} />,
            url: "/payments",
          };
        case "INFO":
          return {
            title: "Nouveau Paiement !",
            description: paymentId
              ? `${
                  payments.find((el) => el.id === notification.paymentId)
                    ?.ref ?? "Référence du paiement"
                } de ${XAF.format(
                  payments.find((x) => x.id === notification.paymentId)
                    ?.total ?? 0
                )} a été validé `
              : "Consultez la liste des paiements",
            date: new Date(notification.createdAt),
            icon: <DollarSign size={size} />,
            url: "/payments",
          };
        case "DANGER":
          return {
            title: "Echec Paiement !",
            description: paymentId
              ? `${
                  payments.find((el) => el.id === notification.paymentId)
                    ?.ref ?? "Référence du paiement"
                } de ${XAF.format(
                  payments.find((x) => x.id === notification.paymentId)
                    ?.total ?? 0
                )} a échoué `
              : "Consultez la liste des paiements",
            date: new Date(notification.createdAt),
            icon: <DollarSign size={size} />,
            url: "/payments",
          };
        case "WARNING":
          return {
            title: "Paiement en attente !",
            description: paymentId
              ? `${
                  payments.find((el) => el.id === notification.paymentId)
                    ?.ref ?? "Référence du paiement"
                } de ${XAF.format(
                  payments.find((x) => x.id === notification.paymentId)
                    ?.total ?? 0
                )} est toujours en attente `
              : "Consultez la liste des paiements",
            date: new Date(notification.createdAt),
            icon: <DollarSign size={size} />,
            url: "/payments",
          };
      }
    } else {
      switch (notification.variant) {
        case "DANGER":
          return {
            title: "Stock épuisé !",
            description: stockId
              ? `${
                  stocks.find((el) => el.id === notification.stockId)
                    ?.productVariant?.name ?? "Nom de la variante"
                } ${
                  stocks.find((el) => el.id === notification.stockId)
                    ?.productVariant?.quantity
                } ${
                  stocks.find((el) => el.id === notification.stockId)
                    ?.productVariant?.unit
                } de ${
                  products.find(p=>p.variants?.some(el =>el.id === stocks.find((el) => el.id === notification.stockId)?.productVariantId))?.name
                } est épuisé à ${shops.find(e=>e.id === stocks.find((el) => el.id === notification.stockId)?.shopId)?.name}.`
              : "Réapprovisionnez votre stock !",
            date: new Date(notification.createdAt),
            icon: <PackageX size={size} />,
            url: "/inventory",
          };
        case "WARNING":
          return {
            title: "Stock faible !",
            description: stockId
              ? `${
                  stocks.find((el) => el.id === notification.stockId)
                    ?.productVariant?.name ?? "Nom de la variante"
                } ${
                  stocks.find((el) => el.id === notification.stockId)
                    ?.productVariant?.quantity
                } ${
                  stocks.find((el) => el.id === notification.stockId)
                    ?.productVariant?.unit
                } de ${
                  stocks.find((el) => el.id === notification.stockId)?.shop
                    ?.name
                } est faible `
              : "Réapprovisionnez votre stock !",
            date: new Date(notification.createdAt),
            icon: <Package size={size} />,
            url: "/inventory",
          };
        default:
          return {
            title: "Stock",
            description: notification.description,
            date: new Date(notification.createdAt),
            icon: <PackageX size={size} />,
            url: "/inventory",
          };
      }
    }
  };

  const value = getNotificationObject({
    id,
    type,
    createdAt,
    variant,
    orderId,
    stockId,
    paymentId,
    action,
    description,
  });

  return (
    <div
      className={cn(
        notificationVariants({ variant: getVariantStyle(variant) })
      )}
    >
      <span className={cn("w-16 h-16 rounded-md border flex items-center justify-center shrink-0 bg-white", getBadgeVariantStyle(variant))}>{value.icon}</span>
      <Link href={`/dashboard${value.url}`} className="w-full flex flex-col gap-0.5">
        <div className="w-full flex flex-col md:flex-row gap-2 justify-start md:justify-between">
          <span className={cn("text-base xl:text-lg font-semibold text-black")}>
            {value.title}
          </span>
          <span className="text-xs md:text-sm text-gray-400">
            {formatRelative(value.date, new Date(), { locale: fr })}
          </span>
        </div>
        <p className="text-gray-600">{value.description}</p>
      </Link>

      <Button
        size="icon"
        variant="ghost"
        onClick={() =>removeNotification.mutate(id)}
        aria-label="Supprimer la notification"
      >
        <X size={16} />
      </Button>
    </div>
  );
}

export default Notification;
