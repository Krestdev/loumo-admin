import { LucideProps } from "lucide-react";
import React, { ForwardRefExoticComponent, RefAttributes } from "react";

export interface navigationHeader {
    title:string;
    header:string;
    description?:string;
    url: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
}

export interface sidebarItemGroup {
    title: string;
    items: navigationHeader[];
}
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
};

export type Agent = {
  id: number;
  userId: number;
  code: string;
  user?: User;
  delivery?: Delivery[];
};

export type Category = {
  name: string;
  id: number;
  weight: number;
  status: boolean;
  products?: Product[];
  imgUrl?: string;
};

export type Delivery = {
  id: number;
  status: string;
  agentId: number | null;
  orderId: number;
  orderItem?: OrderItem[];
  agent?: Agent;
  order?: Order;
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
  userId: number;
  note: string;
  addressId: number;
  orderItems?: OrderItem[];
  payment?: Payment[];
  delivery?: Delivery[];
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
  status: string;
  orderId: number;
  order?: Order[];
  total: number;
  ref: string;
};

export type Permission = {
  id: number;
  action: string;
  role?: Role[];
};

export type Product = {
  name: string;
  id: number;
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
  status: boolean;
  price: number;
  productId: number;
  product?: Product;
  stock: Stock;
};

export type Promotion = {
  id: number;
  code: string;
  percentage: number;
  expireAt: Date;
  stock?: Stock[];
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
  productVariantId: number;
  productVariant?: ProductVariant;
  shopId: number;
  shop?: Shop;
  promotionId: number | null;
  promotion?: Promotion;
};

export type User = {
  id: number;
  email: string;
  password: string;
  name: string | null;
  passwordResetOtp: string | null;
  passwordResetOtpExpires: Date | null;
  tel: string | null;
  verified: boolean;
  verificationOtp: string | null;
  verificationOtpExpires: Date | null;
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
