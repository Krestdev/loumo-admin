import { sidebarItemGroup } from "@/types/types";
import {
    Bell,
    CreditCard,
    Gift,
    Home,
    Layers,
    MapPin,
    Package,
    Settings,
    Shield,
    ShoppingCart,
    Star,
    Store,
    Tag,
    Truck,
    Users,
    Warehouse
} from "lucide-react";

export const sidebarContent: sidebarItemGroup[] = [
  {
    title: "Tableau de bord",
    items: [
      {
        title: "Tableau de bord",
        header: "Tableau de bord",
        description: "Vue d'ensemble de votre activité",
        url: "/",
        icon: Home,
      },
      {
        title: "Commandes",
        header: "Gestion des Commandes",
        description: "Gérez et suivez toutes les commandes",
        url: "/orders",
        icon: ShoppingCart,
      },
      {
        title: "Paiements",
        header: "Gestion desPaiements",
        description: "Suivez les transactions et méthodes de paiement",
        url: "/payments",
        icon: CreditCard,
      },
      {
        title: "Livraisons",
        header: "Gestion des Livraisons",
        description: "Suivez et assignez les livraisons",
        url: "/deliveries",
        icon: Truck,
      },
    ],
  },
  {
    title: "Produits",
    items: [
      {
        title: "Produits",
        header: "Gestion des Produits",
        description: "Gérez votre catalogue de produits",
        url: "/products",
        icon: Package,
      },
      {
        title: "Variantes de produits",
        header: "Variantes de produits",
        description: "Gérez les différentes variantes de vos produits",
        url: "/variants",
        icon: Layers,
      },
      {
        title: "Catégories",
        header: "Gestion des Catégories",
        description: "Gérez les catégories de vos produits",
        url: "/categories",
        icon: Tag,
      },
      {
        title: "Inventaire",
        header: "Gestion de l'Inventaire",
        description: "Gérez votre stock et vos niveaux de réapprovisionnement",
        url: "/inventory",
        icon: Warehouse,
      },
    ],
  },
  {
    title: "Utilisateurs",
    items: [
      {
        title: "Clients",
        header: "Gestion des Clients",
        description: "Gérez vos clients et leurs informations",
        url: "/clients",
        icon: Users,
      },
      {
        title: "Mon Equipe",
        header: "Equipe Loumo",
        description: "Gérez le personnel d'administration",
        url: "/staff",
        icon: Users,
      },
      {
        title: "Rôles & permissions",
        header: "Rôles & permissions",
        description: "Gérez les rôles et leurs permissions d'accès",
        url: "/roles",
        icon: Shield,
      },
    ],
  },
  {
    title: "Marketing",
    items: [
      {
        title: "Promotions",
        header: "Gestion des Promotions",
        description: "Créez et gérez vos offres promotionnelles",
        url: "/promotions",
        icon: Gift,
      },
      {
        title: "Fidélité",
        header: "Programme de Fidélité",
        description: "Gérez les points et les récompenses de vos clients",
        url: "/loyalty",
        icon: Star,
      },
    ],
  },
  {
    title: "Points de vente",
    items: [
      {
        title: "Zones de livraison",
        header: "Gestion des Zones de livraison",
        description: "Gérez les zones de livraisons et les adresses",
        url: "/zones",
        icon: MapPin,
      },
      {
        title: "Points de vente",
        header: "Gestion des Points de vente",
        description: "Créez et gérez vos points de vente",
        url: "/stores",
        icon: Store,
      },
    ],
  },
  {
    title: "Système",
    items: [
      {
        title: "Notifications",
        header: "Notifications",
        url: "/notifications",
        icon: Bell,
      },
      {
        title: "Avis",
        header: "Gestion des Avis",
        url: "/reviews",
        icon: Star,
      },
      {
        title: "Paramètres",
        header: "Configuration des paramètres",
        url: "/settings",
        icon: Settings,
      },
    ],
  },
];
