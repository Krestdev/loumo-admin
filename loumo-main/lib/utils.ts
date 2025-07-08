import { Delivery, Order, Payment } from "@/types/types";
import { clsx, type ClassValue } from "clsx"
import { isAfter, subDays } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const XAF = new Intl.NumberFormat('fr-FR',{
    style: "currency",
    currency: "XAF"
  });
export function formatXAF(value?: number): string {
  return typeof value === "number"
    ? `${value.toLocaleString("fr-FR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })} FCFA`
    : "- FCFA";
}

export function filterByDate<T extends { createdAt?: Date | string }>(
  items: T[],
  days: number
): T[] {
  const limitDate = subDays(new Date(), days);
  return items.filter((item) => {
    if (!item.createdAt) return false;
    const created = new Date(item.createdAt);
    return isAfter(created, limitDate);
  });
}

export function findLatestByDate<T>(
  items: T[],
  dateKey: keyof T
): T | null {
  if (items.length === 0) return null;

  return items.reduce((latest, current) => {
    const latestDate = new Date(latest[dateKey] as string | Date);
    const currentDate = new Date(current[dateKey] as string | Date);

    return currentDate > latestDate ? current : latest;
  });
}

export const statusMap: Record<string, Order["status"][]> = {
    "En cours": ["PENDING", "ACCEPTED"],
    "En Préparation": ["PROCESSING"],
    "En livraison": ["ACCEPTED"], // si tu différencies
    "Livré": ["COMPLETED"],
    "Annulé": ["REJECTED", "FAILED"],
  };

export const paymentStatusMap: Record<string, Payment["status"][]> = {
    Payé: ["COMPLETED", "ACCEPTED"],
    "En attente": ["PENDING", "PROCESSING"],
    Échoué: ["FAILED"],
    Rejeté: ["REJECTED"],
  };

  export const getOrderStatusLabel = (status: Order["status"]): string => {
  switch (status) {
    case "PENDING":
      return "En attente";
    case "ACCEPTED":
      return "Acceptée";
    case "REJECTED":
      return "Rejetée";
    case "PROCESSING":
      return "En cours de traitement";
    case "COMPLETED":
      return "Terminée";
    case "FAILED":
      return "Échouée";
    default:
      return "Statut inconnu";
  }
};

export const getPriorityName = (priority: Delivery["priority"]) => {
  switch (priority) {
    case "URGENT":
      return "Urgent";
    case "HIGH":
      return "Haute";
    case "LOW":
      return "Faible";
    default:
      return "Normale";
  }
};

export const getStatusColor = (status: Delivery["status"]) => {
  switch (status) {
    case "NOTSTARTED":
      return "warning";
    case "COMPLETED":
      return "default";
    case "STARTED":
      return "info";
    case "CANCELED":
      return "destructive";
    default:
      return "outline";
  }
};

export const getPriorityColor = (priority: Delivery["priority"]) => {
  switch (priority) {
    case "URGENT":
      return "destructive";
    case "HIGH":
      return "warning";
    case "LOW":
      return "outline";
    default:
      return "info";
  }
};