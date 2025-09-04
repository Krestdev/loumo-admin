import { units } from "@/data/unit";
import { AgentStatus, DeliveryPriority, DeliveryStatus, Order, OrderStatus, Payment, PaymentStatus, User } from "@/types/types";
import { clsx, type ClassValue } from "clsx";
import { isAfter, subDays } from "date-fns";
import { twMerge } from "tailwind-merge";

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

   export const payStatusName = (status: Payment["status"]): string => {
    switch (status) {
      case "ACCEPTED":
        return "Accepté";
      case "COMPLETED":
        return "Terminé";
      case "FAILED":
        return "Echoué";
      case "PENDING":
        return "En cours";
      case "PROCESSING":
        return "Traitement";
      case "REJECTED":
        return "Rejeté";
      default:
        return "Inconnu";
    }
  };

export const paymentStatusMap: Record<string, PaymentStatus[]> = {
    "Payé": ["COMPLETED", "ACCEPTED"],
    "En attente": ["PENDING", "PROCESSING"],
    "Échoué": ["FAILED"],
    "Rejeté": ["REJECTED"],
  };

  export const getOrderStatusLabel = (status: OrderStatus): string => {
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

export const getPriorityName = (priority: DeliveryPriority) => {
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

export const getStatusColor = (status: DeliveryStatus) => {
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

export const getPriorityColor = (priority: DeliveryPriority) => {
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

export const unitName = (unit :string) =>{
  switch(unit){
    case "g":
      return "Gramme (g)";
    case "kg":
      return "Kilogramme (kg)";
    case "pièce":
      return "Pièce/Unité";
    case "L":
      return "Litre (L)";
    case "ml":
      return "Mililitre (ml)";
    case "cl":
      return "Centilitre (cl)";
    case "boite":
      return "Boîte";
    case "bouteille":
      return "Bouteille";
    default:
      return "unknown";
  }
}

export const agentStatusName = (status: AgentStatus):string =>{
  switch(status){
    case "AVAILABLE":
      return "Disponible";
    case "FULL":
      return "Occupé";
    case "SUSPENDED":
      return "Suspendu";
    case "UNAVAILABLE":
      return "Indisponible";
    case "UNVERIFIED":
      return "Non vérifié";
    default:
      return "Statut inconnu";
  }
}

export const getDeliveryStatusName = (status : DeliveryStatus):string => {
  switch(status){
    case "COMPLETED":
      return "Terminé";
    case "CANCELED":
      return "Annulé";
    case "NOTSTARTED":
      return "Non démarré";
    case "STARTED":
      return "En cours";
    default: 
    return "Inconnu";
  }
}

export function getOrdersByDay(orders: Order[], dayOffset: number = 0): Order[] {
  const now = new Date();
  const targetDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset);
  const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset + 1);

  return orders.filter((order) => {
    const createdAt = new Date(order.createdAt);
    return createdAt >= targetDay && createdAt < nextDay;
  });
}

export function getClientsByDay(clients:User[], dayOffset: number = 0):User[] {
  const now = new Date();
  const targetDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset);
  const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset + 1);

  return clients.filter((client)=> {
    const createdAt = new Date(client.updatedAt);
    return createdAt >= targetDay && createdAt < nextDay;
  })
}

export function sortOrdersByNewest(orders: Order[]): Order[] {
  return [...orders].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function isExpired(date: Date): boolean {
  return date > new Date(); 
}

/**Period filter settings */
export function isWithinPeriod(date: Date | string, period: string): boolean {
    const createdAt = new Date(date);
    const now = new Date();

    switch (period) {
      case "1days":
      case "7days":
      case "30days":
      case "90days":
        const days = parseInt(period.replace("days", ""));
        const threshold = new Date();
        threshold.setDate(now.getDate() - days);
        return createdAt >= threshold;

      case "year":
        return createdAt.getFullYear() === now.getFullYear();

      case "all":
      default:
        return true;
    }
  }

  export function splitVariantName(fullName: string): {
  name: string;
  quantity: string;
  unit: string;
} {
  const parts = fullName.trim().split(/\s+/); // découpe par espace

  for (let i = 0; i < parts.length - 1; i++) {
    const maybeQuantity = parts[i];
    const maybeUnit = parts[i + 1];

    const isNumber = !isNaN(Number(maybeQuantity));
    const isValidUnit = units.some(x=> x === maybeUnit);

    if (isNumber && isValidUnit) {
      const nameParts = parts.slice(0, i);
      return {
        name: nameParts.join(" "),
        quantity: maybeQuantity,
        unit: maybeUnit,
      };
    }
  }

  // fallback (au cas où rien ne matche)
  return {
    name: fullName,
    quantity: "",
    unit: units[0],
  };
}

export function formatName(text: string): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}



