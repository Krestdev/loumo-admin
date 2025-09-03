"use client";

import { DateRangePicker } from "@/components/dateRangePicker";
import PageLayout from "@/components/page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { fetchAll } from "@/hooks/useData";
import { XAF } from "@/lib/utils";
import { useStore } from "@/providers/datastore";
import ProductQuery from "@/queries/product";
import ProductVariantQuery from "@/queries/productVariant";
import ShopQuery from "@/queries/shop";
import StockQuery from "@/queries/stock";
import { Product, ProductVariant, Shop, Stock } from "@/types/types";
import { format, formatRelative, isToday } from "date-fns";
import { fr } from "date-fns/locale";
import { AlertTriangle, Calendar, CirclePlus, Package } from "lucide-react";
import React, { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import Restock from "./add";
import CreateStockPage from "./createStock";

export default function InventoryPage() {
  const stockQuery = new StockQuery();
  const shopQuery = new ShopQuery();
  const productQuery = new ProductQuery();
  const variantQuery = new ProductVariantQuery();
  const getStocks = fetchAll(stockQuery.getAll, "stocks");
  const getShops = fetchAll(shopQuery.getAll, "shops");
  const getProducts = fetchAll(productQuery.getAll, "products");
  const getVariants = fetchAll(variantQuery.getAll, "variants");

  const { setLoading } = useStore();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  React.useEffect(() => {
    setLoading(
      getShops.isLoading || getStocks.isLoading || getProducts.isLoading || getVariants.isLoading
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
    if (getVariants.isSuccess) {
      setVariants(getVariants.data);
    }
  }, [
    setLoading,
    getShops.isLoading,
    getStocks.isLoading,
    getShops.isSuccess,
    getStocks.isSuccess,
    getShops.data,
    getStocks.data,
    getProducts.isLoading,
    getProducts.data,
    getProducts.isSuccess,
    getVariants.isLoading,
    getVariants.data,
    getVariants.isSuccess,
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [selectedShop, setSelectedShop] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [selectedStock, setSelectedStock] = useState<Stock>();
  const [addDialog, setAddDialog] = useState<boolean>(false);

  const [createDialog, setCreateDialog] = useState<boolean>(false);

  const filteredData = useMemo(() => {
    return stocks.filter((item) => {
      const matchesSearch =
        item.productVariant?.name
          .toLocaleLowerCase()
          .includes(searchTerm.toLocaleLowerCase()) ||
        products.some(
          (y) =>
            y.name
              .toLocaleLowerCase()
              .includes(searchTerm.toLocaleLowerCase()) &&
            y.variants?.some((z) => z.id === item.productVariantId)
        );

      const matchesProduct =
        selectedProduct === "all" ||
        String(item.productVariant?.productId) === selectedProduct;

      const matchesShop =
        selectedShop === "all" || String(item.shopId) === selectedShop;

      const matchesThreshold =
        stockFilter === "all" ||
        (stockFilter === "low" &&
          item.quantity <= item.threshold &&
          item.quantity > 0) ||
        (stockFilter === "ok" && item.quantity > item.threshold) ||
        (stockFilter === "out" && item.quantity === 0);

      const matchesDate =
        (!dateRange?.from ||
          new Date(item.restockDate ?? Date.now()) >=
            new Date(dateRange.from.setHours(0, 0, 0, 0))) &&
        (!dateRange?.to ||
          new Date(item.restockDate ?? Date.now()) <=
            new Date(dateRange.to.setHours(23, 59, 59, 999)));

      return (
        matchesSearch &&
        matchesProduct &&
        matchesShop &&
        matchesThreshold &&
        matchesDate
      );
    });
  }, [
    stocks,
    searchTerm,
    selectedProduct,
    selectedShop,
    stockFilter,
    products,
    dateRange,
  ]);

  const lastUpdate = useMemo(() => {
    if (stocks.length === 0) return null;

    // Récupère toutes les dates de mise à jour/restock
    const dates = stocks
      .map((s) => (s.restockDate ? new Date(s.restockDate) : null))
      .filter((d): d is Date => d !== null);

    if (dates.length === 0) return null;

    // Dernière MAJ = la plus récente
    return new Date(Math.max(...dates.map((d) => d.getTime())));
  }, [stocks]);

  const handleRestock = (item: Stock) => {
    setSelectedStock(item);
    setAddDialog(true);
  };

  return (
    <PageLayout
      isLoading={
        getShops.isLoading || getStocks.isLoading || getProducts.isLoading || getVariants.isLoading
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
            <div
              className={`text-2xl font-bold ${
                stocks.filter((x) => x.quantity <= x.threshold).length > 0 &&
                "text-red-600"
              }`}
            >
              {stocks.filter((x) => x.quantity <= x.threshold).length}
            </div>
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
            <div className="text-2xl font-bold">
              {XAF.format(
                stocks.reduce(
                  (total, x) =>
                    total + x.quantity * (x.productVariant?.price ?? 0),
                  0
                )
              )}
            </div>
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
            {lastUpdate ? (
              <>
                <div className="text-2xl font-bold">
                  {isToday(lastUpdate)
                    ? "Aujourd'hui"
                    : format(lastUpdate, "dd/MM/yyyy", { locale: fr })}
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(lastUpdate, "HH:mm")}
                </p>
              </>
            ) : (
              <div className="text-2xl font-bold">--</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{"Filtres"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            <div className="space-y-2 col-span-1 sm:col-span-2">
              <label className="text-sm font-medium">{"Recherche"}</label>
              <Input
                placeholder="Rechercher par nom"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{"Point de vente"}</label>
              <Select value={selectedShop} onValueChange={setSelectedShop}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"Tous"}</SelectItem>
                  {shops
                    .filter((z) => stocks.some((y) => y.shopId === z.id))
                    .map((x) => (
                      <SelectItem key={x.id} value={String(x.id)}>
                        {x.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{"Produit"}</label>
              <Select
                value={selectedProduct}
                onValueChange={setSelectedProduct}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner" />
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
            <div className="space-y-2">
              <label className="text-sm font-medium">{"Etat du stock"}</label>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"Tous"}</SelectItem>
                  <SelectItem value={"low"}>{"Critique"}</SelectItem>
                  <SelectItem value={"ok"}>{"Non critique"}</SelectItem>
                  <SelectItem value={"out"}>{"Epuisé"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{"Période"}</label>
              <DateRangePicker
                date={dateRange}
                onChange={setDateRange}
                className="!w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex flex-col gap-2">
            <CardTitle>{"Stock par produit"}</CardTitle>
            <CardDescription>{`${filteredData.length} stock(s) affiché(s)`}</CardDescription>
          </div>
          <Button onClick={() => setCreateDialog(true)}>
            <CirclePlus size={16} />
            {"Créer un Stock"}
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{"Variante"}</TableHead>
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
                      alt="no-image"
                      className="w-1/3 max-w-32 h-auto mx-auto mt-5 opacity-20"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.productVariant ? `${item.productVariant.name} ${item.productVariant.quantity} ${item.productVariant.unit}`  : "Non défini"}
                    </TableCell>
                    <TableCell>
                      {products.find((x) =>
                        x.variants?.some((y) => y.id === item.productVariantId)
                      )?.name ?? "Non défini"}
                    </TableCell>
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
                      {item.restockDate
                        ? formatRelative(
                            new Date(item.restockDate),
                            new Date(),
                            { locale: fr }
                          )
                        : "--"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.quantity === 0
                            ? "destructive"
                            : item.quantity <= item.threshold
                            ? "warning"
                            : "outline"
                        }
                      >
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
                      <Button
                        variant={
                          item.quantity <= item.threshold
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => handleRestock(item)}
                      >
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
      {!!selectedStock && (
        <Restock
          isOpen={addDialog}
          openChange={setAddDialog}
          products={products}
          stock={selectedStock}
          shops={shops}
        />
      )}
      <CreateStockPage isOpen={createDialog} openChange={setCreateDialog} shops={shops} variants={variants} products={products}/>
    </PageLayout>
  );
}
