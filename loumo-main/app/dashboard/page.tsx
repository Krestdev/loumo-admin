import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  DollarSign,
  Package,
  ShoppingCart,
  Truck,
  Users
} from "lucide-react";
import Link from "next/link";

const kpis = [
  {
    title: "Commandes aujourd'hui",
    value: "127",
    change: "+12%",
    changeType: "positive" as const,
    icon: ShoppingCart,
  },
  {
    title: "Chiffre d'affaires",
    value: "€24,580",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: DollarSign,
  },
  {
    title: "Utilisateurs actifs",
    value: "2,847",
    change: "+5.1%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Produits en rupture",
    value: "23",
    change: "-3",
    changeType: "negative" as const,
    icon: AlertTriangle,
  },
];

const recentOrders = [
  {
    id: "#ORD-001",
    customer: "Marie Dubois",
    zone: "Dakar Plateau",
    amount: "€45.80",
    status: "En cours",
    weight: "12.5kg",
  },
  {
    id: "#ORD-002",
    customer: "Amadou Ba",
    zone: "Parcelles Assainies",
    amount: "€78.20",
    status: "Livré",
    weight: "18.2kg",
  },
  {
    id: "#ORD-003",
    customer: "Fatou Sall",
    zone: "Almadies",
    amount: "€32.50",
    status: "Préparation",
    weight: "8.7kg",
  },
  {
    id: "#ORD-004",
    customer: "Ousmane Diop",
    zone: "Yoff",
    amount: "€91.30",
    status: "En livraison",
    weight: "25.1kg",
  },
];

const lowStockProducts = [
  {
    name: "Riz Brisé 25kg",
    stock: 5,
    minStock: 20,
    store: "Boutique Plateau",
  },
  {
    name: "Huile Tournesol 5L",
    stock: 8,
    minStock: 15,
    store: "Boutique Parcelles",
  },
  {
    name: "Savon Marseille x12",
    stock: 3,
    minStock: 10,
    store: "Boutique Almadies",
  },
];

export default function Dashboard() {
  return (
    <main className="flex-1 overflow-auto p-4 space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">
                <span
                  className={
                    kpi.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {kpi.change}
                </span>{" "}
                par rapport à hier
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Commandes récentes
            </CardTitle>
            <CardDescription>
              Les dernières commandes passées sur la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{order.id}</span>
                      <Badge
                        variant={
                          order.status === "Livré"
                            ? "default"
                            : order.status === "En livraison"
                            ? "secondary"
                            : order.status === "En cours"
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.customer}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.zone} • {order.weight}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Alertes stock faible
            </CardTitle>
            <CardDescription>
              Produits nécessitant un réapprovisionnement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.map((product, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.store}
                      </p>
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      {product.stock} restant
                    </Badge>
                  </div>
                  <Progress
                    value={(product.stock / product.minStock) * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Accès rapide aux fonctionnalités principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href={"/dashboard/products?open=add"}>
              <Button variant="outline" className="h-20 flex-col gap-2 w-full">
                <Package className="h-6 w-6" />
                <span className="text-sm">Ajouter produit</span>
              </Button>
            </Link>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <ShoppingCart className="h-6 w-6" />
              <span className="text-sm">Nouvelle commande</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Truck className="h-6 w-6" />
              <span className="text-sm">Planifier livraison</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">Gérer clients</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
