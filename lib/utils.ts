import { Order, Payment } from "@/types/types";
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
    Préparation: ["PROCESSING"],
    "En livraison": ["ACCEPTED"], // si tu différencies
    Livré: ["COMPLETED"],
    Annulé: ["REJECTED", "FAILED"],
  };

export const paymentStatusMap: Record<string, Payment["status"][]> = {
    Payé: ["COMPLETED", "ACCEPTED"],
    "En attente": ["PENDING", "PROCESSING"],
    Échoué: ["FAILED"],
    Rejeté: ["REJECTED"],
  };
