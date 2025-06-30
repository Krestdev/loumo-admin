"use client"

import PageLayout from "@/components/page-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { XAF } from "@/lib/utils"
import { useStore } from "@/providers/datastore"
import ProductQuery from "@/queries/product"
import ProductVariantQuery from "@/queries/productVariant"
import { Product, ProductVariant } from "@/types/types"
import { useQuery } from "@tanstack/react-query"
import { Edit, Eye, Layers, Package, Palette, PlusCircle, Search, Trash2, Weight } from "lucide-react"
import Link from "next/link"
import React from "react"
import { useState } from "react"
import ViewVariant from "./view"
import DeleteVariant from "./delete"


export default function VariantsPage() {

  const actions = new ProductVariantQuery();
  const productQuery = new ProductQuery();
  const variantsData = useQuery({
    queryKey: ["variants"],
    queryFn: () => actions.getAll(),
    refetchOnWindowFocus: false
  });
  const productsData = useQuery({
    queryKey: ["products"],
    queryFn: () => productQuery.getAll(),
    refetchOnWindowFocus: false
  });

  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const {setLoading} = useStore();

  React.useEffect(()=>{
    setLoading(variantsData.isLoading);
    if(variantsData.isSuccess){
      setVariants(variantsData.data);
    }
    if(productsData.isSuccess){
      setProducts(productsData.data);
    }
  },[variantsData.isSuccess, variantsData.data, variantsData.isLoading, setLoading, productsData.isSuccess, productsData.data])

  const [selectedVariant, setSelectedVariant] = useState(variants[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [productFilter, setProductFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeVariant, setActiveVariant] = useState<ProductVariant | undefined>();
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);

  const filteredVariants = variants.filter((variant) => {
    const matchesSearch =
      //variant.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variant.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProduct = productFilter === "all" || variant.productId.toString() === productFilter
    return matchesSearch && matchesProduct
  })

  const handleEdit = (variant:ProductVariant) => {
    setActiveVariant(variant);
    setEditDialog(true);
  }
  const handleDelete = (variant:ProductVariant) => {
    setActiveVariant(variant);
    setDeleteDialog(true);
  }
  const handleView = (variant:ProductVariant) => {
    setActiveVariant(variant);
    setIsDialogOpen(true);
  }


  return (
    <PageLayout className="flex h-screen flex-col" isLoading={variantsData.isLoading || productsData.isLoading}>
      <main className="flex-1 overflow-auto p-4 space-y-6">
        {/* Variant Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{"Total variantes"}</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{variants.length}</div>
              <p className="text-xs text-muted-foreground">{`${variants.filter((v) => v.status).length} actives`}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{"Produits avec variantes"}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Set(variants.map((v) => v.productId)).size}</div>
              <p className="text-xs text-muted-foreground">{"Produits configurés"}</p>
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
              <CardTitle className="text-sm font-medium">{"Stock total"}</CardTitle>
              <Package className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {variants.reduce((sum, variant) => sum + variant.stock.quantity, 0)}
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
                    placeholder="Rechercher par produit, variante ou SKU..."
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
                  {Array.from(new Set(variants.map((v) => ({ id: v.productId, name: products.find(x=>x.id === v.productId)?.name || "Non défini"})))).map(
                    (product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.name}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
              <Link href={"/dashboard/variants/add"}>
                <Button><PlusCircle size={16}/> {"Ajouter"}</Button>
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
                {filteredVariants.map((variant) => {
                  return (
                    <TableRow key={variant.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={variant.imgUrl || "/images/placeholder.svg"}
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
                          <p className="font-medium">{products.find(x=>x.id === variant.productId)?.name || 'Non défini'}</p>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{XAF.format(variant.price)}</p>
                          {/* {variant.priceAdjustment !== 0 && (
                            <p className="text-sm text-muted-foreground">
                              {variant.priceAdjustment > 0 ? "+" : ""}€{variant.priceAdjustment.toFixed(2)}
                            </p>
                          )} */}
                        </div>
                      </TableCell>
                      <TableCell>
                        {`${variant.weight} g`}
                      </TableCell>
                      <TableCell>
                        <Badge variant={variant.status ? "default" : "secondary"}>
                          {variant.status ? "Actif" : "Désactivé"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant={"outline"} size={"icon"} onClick={()=>handleView(variant)}><Eye size={16}/></Button>
                          <Button variant="outline" size="icon" onClick={() =>handleEdit(variant)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={()=>handleDelete(variant)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
      { activeVariant && <ViewVariant variant={activeVariant} products={products} isOpen={isDialogOpen} openChange={setIsDialogOpen}/>}
      {activeVariant && <DeleteVariant variant={activeVariant} products={products} isOpen={deleteDialog} openChange={setDeleteDialog}/>}
    </PageLayout>
  )
}
