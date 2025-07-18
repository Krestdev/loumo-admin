"use client";

import PageLayout from "@/components/page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { XAF } from "@/lib/utils";
import { useStore } from "@/providers/datastore";
import ProductQuery from "@/queries/product";
import ProductVariantQuery from "@/queries/productVariant";
import ShopQuery from "@/queries/shop";
import { Product, ProductVariant, Shop } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import {
  Edit,
  Eye,
  Layers,
  MoreHorizontal,
  Package,
  PlusCircle,
  Search,
  Trash2
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import DeleteVariant from "./delete";
import EditVariant from "./edit";
import ViewVariant from "./view";

export default function VariantsPage() {
  const actions = new ProductVariantQuery();
  const productQuery = new ProductQuery();
  const shopQuery = new ShopQuery();
  const variantsData = useQuery({
    queryKey: ["variants"],
    queryFn: () => actions.getAll(),
    refetchOnWindowFocus: false,
  });
  const productsData = useQuery({
    queryKey: ["products"],
    queryFn: () => productQuery.getAll(),
    refetchOnWindowFocus: false,
  });
  const shopData = useQuery({
    queryKey: ["shops"],
    queryFn: () => shopQuery.getAll(),
    refetchOnWindowFocus: false,
  });

  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);

  const { setLoading } = useStore();

  React.useEffect(() => {
    setLoading(
      variantsData.isLoading || productsData.isLoading || shopData.isLoading
    );
    if (variantsData.isSuccess) {
      setVariants(variantsData.data);
    }
    if (productsData.isSuccess) {
      setProducts(productsData.data);
    }
    if (shopData.isSuccess) {
      setShops(shopData.data);
    }
  }, [
    variantsData.isSuccess,
    variantsData.data,
    variantsData.isLoading,
    setLoading,
    productsData.isSuccess,
    productsData.data,
    shopData.isSuccess,
    shopData.data,
    setShops,
    productsData.isLoading,
    shopData.isLoading,
  ]);

  //const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [searchTerm, setSearchTerm] = useState("");
  //const [typeFilter, setTypeFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeVariant, setActiveVariant] = useState<
    ProductVariant | undefined
  >();
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);

  const filteredVariants = React.useMemo(() => {
    const normalize = (str: string) =>
      str
        .toLocaleLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, ""); // Supprime les accents

    const term = normalize(searchTerm);

    return variants.filter((variant) => {
      const product = products.find((p) => p.id === variant.productId);

      const matchesSearch =
        normalize(variant.name).includes(term) ||
        (product && normalize(product.name).includes(term));

      const matchesProduct =
        productFilter === "all" ||
        variant.productId.toString() === productFilter;

      return matchesSearch && matchesProduct;
    });
  }, [variants, products, searchTerm, productFilter]);

  const handleEdit = (variant: ProductVariant) => {
    setActiveVariant(variant);
    setEditDialog(true);
  };
  const handleDelete = (variant: ProductVariant) => {
    setActiveVariant(variant);
    setDeleteDialog(true);
  };
  const handleView = (variant: ProductVariant) => {
    setActiveVariant(variant);
    setIsDialogOpen(true);
  };

  return (
    <PageLayout
      className="flex-1 overflow-auto p-4 space-y-6"
      isLoading={variantsData.isLoading || productsData.isLoading}
    >
      {/* Variant Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Total variantes"}
            </CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{variants.length}</div>
            <p className="text-xs text-muted-foreground">{`${
              variants.filter((v) => v.status).length
            } actives`}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Produits avec variantes"}
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(variants.map((v) => v.productId)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              {"Produits configurés"}
            </p>
          </CardContent>
        </Card>

        {/*           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{"Types de variantes"}</CardTitle>
              <Weight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{variantTypes.length}</div>
              <p className="text-xs text-muted-foreground">Types disponibles</p>
            </CardContent>
          </Card> */}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Stock total"}
            </CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {variants.reduce(
                (sum, variant) =>
                  sum +
                  (Array.isArray(variant.stock)
                    ? variant.stock.reduce((s, stock) => s + stock.quantity, 0)
                    : 0),
                0
              )}
            </div>
            <p className="text-xs text-muted-foreground">{"Unités en stock"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Variant Types Overview */}
      {/*         <Card>
          <CardHeader>
            <CardTitle>Types de variantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {variantTypes.map((type) => {
                const Icon = type.icon
                const count = variants.filter((v) => v.type === type.id).length
                return (
                  <Card key={type.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{type.name}</p>
                          <p className="text-sm text-muted-foreground">{count} variantes</p>
                        </div>
                      </div>
                      {type.units.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Unités disponibles:</p>
                          <div className="flex gap-1">
                            {type.units.map((unit) => (
                              <Badge key={unit} variant="outline" className="text-xs">
                                {unit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card> */}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{"Filtres"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par produit ou variante"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            {/* <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {variantTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
            <Select value={productFilter} onValueChange={setProductFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Produit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{"Tous les produits"}</SelectItem>
                {products
                  .filter((x) => variants.some((y) => y.productId === x.id))
                  .map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Link href={"/dashboard/variants/add"}>
              <Button>
                <PlusCircle size={16} /> {"Ajouter"}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Variants Table */}
      <Card>
        <CardHeader>
          <CardTitle>{`Variantes (${filteredVariants.length})`}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{"Variante"}</TableHead>
                <TableHead>{"Produit"}</TableHead>
                <TableHead>{"Prix"}</TableHead>
                <TableHead>{"Poids"}</TableHead>
                <TableHead>{"Stock"}</TableHead>
                <TableHead>{"Statut"}</TableHead>
                <TableHead>{"Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVariants.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-gray-500 py-5 sm:text-lg xl:text-xl"
                  >
                    {"Aucune variante de produit trouvée"}
                    <img
                      src={"/images/search.png"}
                      alt="no-image"
                      className="w-1/3 max-w-32 h-auto mx-auto mt-5 opacity-20"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                filteredVariants.map((variant) => {
                  return (
                    <TableRow key={variant.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              !variant.imgUrl
                                ? "/images/placeholder.svg"
                                : variant.imgUrl.includes("http")
                                ? variant.imgUrl
                                : `${process.env.NEXT_PUBLIC_API_BASE_URL}${variant.imgUrl}`
                            }
                            alt={variant.name}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                          <div>
                            <p className="font-medium">{variant.name}</p>
                            {/* {variant.isDefault && (
                              <Badge variant="outline" className="text-xs">
                                Par défaut
                              </Badge>
                            )} */}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">
                          {products.find((x) => x.id === variant.productId)
                            ?.name || "Non défini"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {XAF.format(variant.price)}
                          </p>
                          {/* {variant.priceAdjustment !== 0 && (
                            <p className="text-sm text-muted-foreground">
                              {variant.priceAdjustment > 0 ? "+" : ""}€{variant.priceAdjustment.toFixed(2)}
                            </p>
                          )} */}
                        </div>
                      </TableCell>
                      <TableCell>{`${variant.weight} g`}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {variant.stock.length > 0 && (
                            <div className="text-xs">
                              {"Total :"}{" "}
                              <span className="font-bold">
                                {variant.stock.reduce(
                                  (s, stock) => s + stock.quantity,
                                  0
                                )}
                              </span>
                            </div>
                          )}
                          {variant.stock.map((x) => (
                            <div key={x.id} className="flex gap-2 text-xs">
                              <span>
                                {shops.find((y) => y.id === x.id)?.name ??
                                  "Undefined"}
                              </span>
                              <span className="font-semibold">
                                {x.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={variant.status ? "default" : "destructive"}
                        >
                          {variant.status ? "Actif" : "Désactivé"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant={"ghost"} size={"icon"}>
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleView(variant)}
                            >
                              <Eye size={16} />
                              {"Voir les détails"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEdit(variant)}
                            >
                              <Edit size={16} />
                              {"Modifier la variante"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => handleDelete(variant)}
                            >
                              <Trash2 size={16} />
                              {"Supprimer"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {activeVariant && (
        <ViewVariant
          shops={shops}
          variant={activeVariant}
          products={products}
          isOpen={isDialogOpen}
          openChange={setIsDialogOpen}
        />
      )}
      {activeVariant && (
        <EditVariant
          variant={activeVariant}
          products={products}
          isOpen={editDialog}
          openChange={setEditDialog}
        />
      )}
      {activeVariant && (
        <DeleteVariant
          variant={activeVariant}
          products={products}
          isOpen={deleteDialog}
          openChange={setDeleteDialog}
        />
      )}
    </PageLayout>
  );
}
