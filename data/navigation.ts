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
    Warehouse,
    Bike
} from "lucide-react";

export const sidebarContent: sidebarItemGroup[] = [
  {
    title: "Tableau de bord",
    items: [
      {
        title: "Tableau de bord",
        header: "Tableau de bord",
        description: "Vue d'ensemble de votre activité",
        url: "/dashboard",
        icon: Home,
        display: true
      },
      {
        title: "Commandes",
        header: "Gestion des Commandes",
        description: "Gérez et suivez toutes les commandes",
        url: "/dashboard/orders",
        icon: ShoppingCart,
        display: true
      },
      {
        title: "Paiements",
        header: "Gestion desPaiements",
        description: "Suivez les transactions et méthodes de paiement",
        url: "/dashboard/payments",
        icon: CreditCard,
        display: true
      },
      {
        title: "Livraisons",
        header: "Gestion des Livraisons",
        description: "Suivez et assignez les livraisons",
        url: "/dashboard/deliveries",
        icon: Truck,
        display: true
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
        url: "/dashboard/products",
        icon: Package,
        display: true
      },
      {
        title: "Ajouter un Produit",
        header: "Ajouter un Produit",
        description: "Complétez le formulaire pour ajouter un produit",
        url: "/dashboard/products/add",
        icon: Package,
        display: false
      },
      {
        title: "Variantes de produits",
        header: "Variantes de produits",
        description: "Gérez les différentes variantes de vos produits",
        url: "/dashboard/variants",
        icon: Layers,
        display: true
      },
      {
        title: "Catégories",
        header: "Gestion des Catégories",
        description: "Gérez les catégories de vos produits",
        url: "/dashboard/categories",
        icon: Tag,
        display: true
      },
      {
        title: "Inventaire",
        header: "Gestion de l'Inventaire",
        description: "Gérez votre stock et vos niveaux de réapprovisionnement",
        url: "/dashboard/inventory",
        icon: Warehouse,
        display: true
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
        url: "/dashboard/clients",
        icon: Users,
        display: true
      },
      {
        title: "Livreurs",
        header: "Gestion des Livreurs",
        description: "Gérez votre équipe de livreurs",
        url: "/dashboard/drivers",
        icon: Bike,
        display: true
      },
      {
        title: "Mon Equipe",
        header: "Equipe Loumo",
        description: "Gérez le personnel d'administration",
        url: "/dashboard/staff",
        icon: Users,
        display: true
      },
      {
        title: "Rôles & permissions",
        header: "Rôles & permissions",
        description: "Gérez les rôles et leurs permissions d'accès",
        url: "/dashboard/roles",
        icon: Shield,
        display: true
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
        url: "/dashboard/promotions",
        icon: Gift,
        display: true
      },
      {
        title: "Fidélité",
        header: "Programme de Fidélité",
        description: "Gérez les points et les récompenses de vos clients",
        url: "/dashboard/loyalty",
        icon: Star,
        display: true
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
        url: "/dashboard/zones",
        icon: MapPin,
        display: true
      },
      {
        title: "Points de vente",
        header: "Gestion des Points de vente",
        description: "Créez et gérez vos points de vente",
        url: "/dashboard/stores",
        icon: Store,
        display: true
      },
    ],
  },
  {
    title: "Système",
    items: [
      {
        title: "Notifications",
        header: "Notifications",
        url: "/dashboard/notifications",
        icon: Bell,
        display: true
      },
      {
        title: "Avis",
        header: "Gestion des Avis",
        url: "/dashboard/reviews",
        icon: Star,
        display: true
      },
      {
        title: "Paramètres",
        header: "Configuration des paramètres",
        url: "/dashboard/settings",
        icon: Settings,
        display: true
      },
    ],
  },
];
