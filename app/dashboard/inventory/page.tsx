"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Download,
  AlertTriangle,
  Package,
  Calendar,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const inventoryData = [
  {
    id: 1,
    product: "Riz Brisé 25kg",
    category: "Céréales",
    store: "Boutique Plateau",
    currentStock: 5,
    minThreshold: 20,
    maxThreshold: 100,
    lastRestock: "2024-01-15",
    supplier: "Fournisseur A",
    status: "critique",
  },
  {
    id: 2,
    product: "Huile Tournesol 5L",
    category: "Huiles",
    store: "Boutique Parcelles",
    currentStock: 15,
    minThreshold: 25,
    maxThreshold: 80,
    lastRestock: "2024-01-20",
    supplier: "Fournisseur B",
    status: "faible",
  },
  {
    id: 3,
    product: "Savon Marseille x12",
    category: "Hygiène",
    store: "Boutique Almadies",
    currentStock: 45,
    minThreshold: 30,
    maxThreshold: 120,
    lastRestock: "2024-01-18",
    supplier: "Fournisseur C",
    status: "normal",
  },
];

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [selectedThreshold, setSelectedThreshold] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critique":
        return <Badge variant="destructive">{"Critique"}</Badge>;
      case "faible":
        return <Badge variant="secondary">{"Faible"}</Badge>;
      case "normal":
        return <Badge variant="default">{"Normal"}</Badge>;
      default:
        return <Badge variant="outline">{"Inconnu"}</Badge>;
    }
  };

  const filteredData = inventoryData.filter((item) => {
    const matchesSearch =
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProduct =
      selectedProduct === "all" || item.product === selectedProduct;
    const matchesThreshold =
      selectedThreshold === "all" || item.status === selectedThreshold;

    let matchesDate = true;
    if (dateFrom && dateTo) {
      const itemDate = new Date(item.lastRestock);
      matchesDate = itemDate >= dateFrom && itemDate <= dateTo;
    }

    return matchesSearch && matchesProduct && matchesThreshold && matchesDate;
  });

  return (
    <main className="flex-1 overflow-auto p-4 space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Total Produits"}
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{"1,247"}</div>
            <p className="text-xs text-muted-foreground">{"+12% ce mois"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Stock Critique"}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{"23"}</div>
            <p className="text-xs text-muted-foreground">
              {"Nécessite réapprovisionnement"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Valeur Stock"}
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{"€847,230"}</div>
            <p className="text-xs text-muted-foreground">
              {"Toutes boutiques"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Dernière MAJ"}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{"Aujourd'hui"}</div>
            <p className="text-xs text-muted-foreground">{"14:30"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{"Filtres"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">{"Recherche"}</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{"Produit"}</label>
              <Select
                value={selectedProduct}
                onValueChange={setSelectedProduct}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les produits" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"Tous les produits"}</SelectItem>
                  <SelectItem value="Riz Brisé 25kg">
                    {"Riz Brisé 25kg"}
                  </SelectItem>
                  <SelectItem value="Huile Tournesol 5L">
                    {"Huile Tournesol 5L"}
                  </SelectItem>
                  <SelectItem value="Savon Marseille x12">
                    {"Savon Marseille x12"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{"Seuil de stock"}</label>
              <Select
                value={selectedThreshold}
                onValueChange={setSelectedThreshold}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les seuils" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"Tous les seuils"}</SelectItem>
                  <SelectItem value="critique">
                    {"Critique (&lt;10%)"}
                  </SelectItem>
                  <SelectItem value="faible">{"Faible (&lt;25%)"}</SelectItem>
                  <SelectItem value="normal">{"Normal (&gt;25%)"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{"Date début"}</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateFrom
                      ? format(dateFrom, "dd/MM/yyyy", { locale: fr })
                      : "Sélectionner"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{"Date fin"}</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateTo
                      ? format(dateTo, "dd/MM/yyyy", { locale: fr })
                      : "Sélectionner"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>{"Stock par produit"}</CardTitle>
          <CardDescription>{`${filteredData.length} produit(s) affiché(s)`}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{"Produit"}</TableHead>
                <TableHead>{"Catégorie"}</TableHead>
                <TableHead>{"Boutique"}</TableHead>
                <TableHead>{"Stock actuel"}</TableHead>
                <TableHead>{"Seuil min"}</TableHead>
                <TableHead>{"Dernier réappro"}</TableHead>
                <TableHead>{"Statut"}</TableHead>
                <TableHead>{"Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.product}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.store}</TableCell>
                  <TableCell>{item.currentStock}</TableCell>
                  <TableCell>{item.minThreshold}</TableCell>
                  <TableCell>
                    {format(new Date(item.lastRestock), "dd/MM/yyyy", {
                      locale: fr,
                    })}
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      {"Réapprovisionner"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
