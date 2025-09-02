import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export interface navigationHeader {
  title: string;
  header: string;
  description?: string;
  url: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

export interface navigationElement extends navigationHeader {
  display: boolean;
}

export interface sidebarItemGroup {
  title: string;
  items: navigationElement[];
}

export type DeliveryPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export type ZoneStatus = "ACTIVE" | "INACTIVE" | "PENDING" | "DISABLED";

export type AgentStatus =
  | "AVAILABLE"
  | "SUSPENDED"
  | "FULL"
  | "UNAVAILABLE"
  | "UNVERIFIED";

export type DeliveryStatus =
  | "NOTSTARTED"
  | "STARTED"
  | "COMPLETED"
  | "CANCELED";

export type OrderStatus =
  | "FAILED"
  | "COMPLETED"
  | "PROCESSING"
  | "REJECTED"
  | "ACCEPTED"
  | "PENDING";

export type PaymentStatus =
  | "FAILED"
  | "COMPLETED"
  | "PROCESSING"
  | "REJECTED"
  | "ACCEPTED"
  | "PENDING";

export type PaymentMethod = "MTN_MOMO_CMR" | "ORANGE_CMR" | "CASH";

export type PromotionStatus = "ACTIVE" | "EXPIRED" | "UPCOMING" | "DISABLED";

export type Address = {
  street: string;
  local: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;
  description: string | null;
  published: boolean;
  zoneId: number | null;
  zone?: Zone;
  users?: User[];
  shops?: Shop[];
  orders?: Order[];
};

export type Zone = {
  name: string;
  id: number;
  price: number;
  addresses: Address[];
  description: string;
  status: ZoneStatus;
};

export type Agent = {
  id: number;
  ref: string;
  userId: number;
  status: AgentStatus;
  user?: User;
  delivery?: Delivery[];
  zone: Zone[];
  zoneIds: number[];
};

export type Category = {
  name: string;
  id: number;
  display: boolean;
  status: boolean;
  products?: Product[];
  imgUrl?: string;
};

export type Delivery = {
  id: number;
  status: DeliveryStatus;
  ref: string;
  priority: DeliveryPriority;
  agentId: number | null;
  orderId: number;
  orderItem?: OrderItem[];
  agent?: Agent;
  order?: Order;
  scheduledTime: Date;
  deliveredTime?: Date;
  estimatedArrival?: Date;
};

export type Log = {
  id: number;
  createdAt: Date | null;
  description: string;
  userId: number | null;
  user?: User;
  action: string;
};

export type NotificationT = {
  id: number;
  createdAt: Date;
  description: string;
  userId: number;
  user?: User;
  action: string;
};

export type Order = {
  id: number;
  ref: string;
  user: User;
  userId: number;
  note: string;
  status: OrderStatus;
  weight: number;
  total: number;
  deliveryFee: number;
  address?: Address;
  addressId: number;
  orderItems?: OrderItem[];
  payment?: Payment;
  delivery?: Delivery[];
  createdAt: string;
};

export type OrderItem = {
  id: number;
  orderId: number;
  order?: Order;
  note: string;
  productVariant?: ProductVariant;
  productVariantId: number;
  quantity: number;
  total: number;
  deliveryId: number | null;
  delivery?: Delivery;
};

export type Payment = {
  name: string;
  id: number;
  status: PaymentStatus;
  orderId: number;
  order: Order;
  total: number;
  ref: string;
  method: PaymentMethod;
};

export type Permission = {
  id: number;
  action: string;
  role?: Role[];
};

export type Product = {
  name: string;
  id: number;
  ref: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  weight: number;
  status: boolean;
  categoryId: number | null;
  category?: Category;
  variants?: ProductVariant[];
};

export type ProductVariant = {
  name: string;
  imgUrl?: string;
  id: number;
  weight: number;
  quantity: number;
  unit: string;
  status: boolean;
  price: number;
  productId: number;
  product?: Product;
  stock: Stock[];
};

export type Promotion = {
  id: number;
  ref: string;
  code: string;
  amount: number; // e.g. 20 => 20% off
  percentage: number;
  expireAt: Date; // expiry date/time
  startAt: Date; // optional start date
  maxUses?: number; // optional max number of uses
  usedCount: number; // optional number of times it’s been used
  status: PromotionStatus; // optional computed status
  description: string; // optional text shown to users
  createdAt: Date;
  updatedAt?: Date;
  stock: Stock["id"][]; // link to affected stock items
};

export type Role = {
  id: number;
  name: string;
  permissions: Permission[];
  user?: User[];
};

export type Shop = {
  name: string;
  id: number;
  addressId: number | null;
  address?: Address;
};

export type Stock = {
  id: number;
  quantity: number;
  threshold: number;
  productVariantId: number;
  productVariant?: ProductVariant;
  shopId: number;
  shop?: Shop;
  promotionId: number | null;
  promotion?: Promotion;
  restockDate?: Date;
};

export type User = {
  id: number;
  email: string;
  password: string;
  name: string;
  passwordResetOtp: string | null;
  passwordResetOtpExpires: Date | null;
  tel: string | null;
  verified: boolean;
  verificationOtp: string | null;
  verificationOtpExpires: Date | null;
  fidelity: number;
  active: boolean;
  imageUrl: string | null;
  roleId: number | null;
  role?: Role;
  orders?: Order[];
  favorite?: Product[];
  logs?: Log[];
  notifications?: NotificationT[];
  addresses?: Address[];
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Faq = {
  id: number;
  question: string;
  answer: string;
  topic: Topic[];
  topicId: number;
};

export type Topic = {
  id: number;
  name: string;
  faqs: Faq[];
};

export type Setting = {
  id: number;
  name: string;
  content?: string;
  value?: number;
  note?: string;
  section: String;
  date?: Date;
};

export type ToastVariant = "default" | "success" | "error" | "warning";
export interface ToastData {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  variant?: ToastVariant;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface variantName {
  name?: string;
  unit: string;
  quantity: number;
}

export interface newProduct {
  name: string;
  description: string;
  status: boolean;
  weight: number;
  categoryId: number;
  variants: newVariant[];
}

export type newVariant = {
  name: string;
  quantity:number;
  imgUrl?: File;
  weight: number;
  status: boolean;
  price: number;
  unit: string;
  stock: {
    quantity: number;
    threshold: number;
    shopId: number;
  }[];
};
