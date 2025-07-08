"use client";

import React, { useMemo, useState } from "react";
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
import { format, formatRelative } from "date-fns";
import { fr } from "date-fns/locale";
import StockQuery from "@/queries/stock";
import { useQuery } from "@tanstack/react-query";
import ShopQuery from "@/queries/shop";
import { Product, Shop, Stock } from "@/types/types";
import { useStore } from "@/providers/datastore";
import PageLayout from "@/components/page-layout";
import ProductQuery from "@/queries/product";
import { XAF } from "@/lib/utils";
import Restock from "./add";

export default function InventoryPage() {
  const stockQuery = new StockQuery();
  const shopQuery = new ShopQuery();
  const productQuery = new ProductQuery();
  const getStocks = useQuery({
    queryKey: ["stocks"],
    queryFn: () => stockQuery.getAll(),
  });
  const getShops = useQuery({
    queryKey: ["shops"],
    queryFn: () => shopQuery.getAll(),
  });
  const getProducts = useQuery({
    queryKey: ["products"],
    queryFn: () => productQuery.getAll(),
  });

  const { setLoading } = useStore();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  React.useEffect(() => {
    setLoading(
      getShops.isLoading || getStocks.isLoading || getProducts.isLoading
    );
    if (getShops.isSuccess) {
      setShops(getShops.data);
    }
    if (getStocks.isSuccess) {
      setStocks(getStocks.data);
    }
    if (getProducts.isSuccess) {
      setProducts(getProducts.data);
    }
  }, [
    getShops.isLoading,
    getStocks.isLoading,
    getShops.isSuccess,
    getStocks.isSuccess,
    getShops.data,
    getStocks.data,
    getProducts.isLoading,
    getProducts.data,
    getProducts.isSuccess,
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [selectedThreshold, setSelectedThreshold] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [selectedStock, setSelectedStock] = useState<Stock>();
  const [addDialog, setAddDialog] = useState<boolean>(false);

  const filteredData = useMemo(() => {
    return stocks.filter((item) => {
      const matchesSearch = item.productVariant?.name.includes(searchTerm);

      const matchesProduct =
        selectedProduct === "all" ||
        String(item.productVariant?.productId) === selectedProduct;
      /* const matchesThreshold =
      selectedThreshold === "all" || item.status === selectedThreshold; */

      /* let matchesDate = true;
    if (dateFrom && dateTo) {
      const itemDate = new Date(item.lastRestock);
      matchesDate = itemDate >= dateFrom && itemDate <= dateTo;
    } */

      return matchesSearch && matchesProduct; //&& matchesThreshold && matchesDate;
    });
  }, [stocks, searchTerm, selectedProduct]);

  const handleRestock = (item: Stock) => {
    setSelectedStock(item);
    setAddDialog(true);
  }

  return (
    <PageLayout
      isLoading={
        getShops.isLoading || getStocks.isLoading || getProducts.isLoading
      }
      className="flex-1 overflow-auto p-4 space-y-6"
    >
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
            <div className="text-2xl font-bold">
              {
                products.filter((x) => x.variants && x.variants.length > 0)
                  .length
              }
            </div>
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
            <div className={`text-2xl font-bold ${stocks.filter(x=>x.quantity <= x.threshold).length > 0 && "text-red-600"}`}>{stocks.filter(x=>x.quantity <= x.threshold).length}</div> 
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
            <div className="text-2xl font-bold">{XAF.format(stocks.reduce((total, x)=> total + x.quantity * (x.productVariant?.price ?? 0), 0))}</div>
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
                  placeholder="Rechercher une variante par nom"
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
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tous les produits" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"Tous les produits"}</SelectItem>
                  {products
                    .filter((z) => z.variants && z.variants.length > 0)
                    .map((x) => (
                      <SelectItem key={x.id} value={String(x.id)}>
                        {x.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* <div className="space-y-2">
              <label className="text-sm font-medium">{"Seuil de stock"}</label>
              <Select
                value={selectedThreshold}
                onValueChange={setSelectedThreshold}
              >
                <SelectTrigger className="w-full">
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
            </div> */}

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
                    disabled
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
                    disabled
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
          <CardDescription>{`${stocks.length} produit(s) affiché(s)`}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{"Produit"}</TableHead>
                <TableHead>{"Boutique"}</TableHead>
                <TableHead>{"Stock actuel"}</TableHead>
                {/* <TableHead>{"Seuil min"}</TableHead> */}
                <TableHead>{"Dernier réappro"}</TableHead>
                <TableHead>{"Statut"}</TableHead>
                <TableHead>{"Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-gray-500 py-5 sm:text-lg xl:text-xl"
                  >
                    {"Aucun produit trouvé"}
                    <img
                      src={"/images/search.png"}
                      className="w-1/3 max-w-32 h-auto mx-auto mt-5 opacity-20"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{`${
                      products.find((x) =>
                        x.variants?.some((y) => y.id === item.productVariantId)
                      )?.name ?? "Non défini"
                    } - ${
                      item.productVariant && item.productVariant.name
                    }`}</TableCell>
                    <TableCell>
                      {shops.find((x) => x.id === item.shopId)?.name ??
                        "Non défini"}
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    {/* <TableCell>{`A définir seuil min`}</TableCell> */}
                    <TableCell>
                      {/* {format(new Date(item.lastRestock), "dd/MM/yyyy", {
                      locale: fr,
                    })} */}
                      {item.restockDate ? formatRelative(new Date(item.restockDate), new Date(), {locale: fr}) : "--"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.quantity === 0
                          ? "destructive"
                          : item.quantity <= item.threshold
                          ? "warning"
                          : "outline"}>
                        {item.quantity === 0
                          ? "Rupture"
                          : item.quantity <= item.threshold
                          ? "Critique"
                          : item.quantity < 20
                          ? "Attention"
                          : "Normal"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={()=>handleRestock(item)}>
                        {"Réapprovisionner"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {
        !!selectedStock && <Restock isOpen={addDialog} openChange={setAddDialog} products={products} stock={selectedStock} shops={shops} />
      }
    </PageLayout>
  );
}
