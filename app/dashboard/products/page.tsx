"use client";

import { DialogTrigger } from "@/components/ui/dialog";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Checkbox } from "@/components/ui/checkbox";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Edit, Trash2, Star, AlertTriangle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import ProductQuery from "@/queries/product";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/providers/datastore";
import PageLayout from "@/components/page-layout";

const products = [
  {
    id: 1,
    name: "Riz Brisé Premium",
    category: "Céréales",
    weight: 25,
    price: 18.5,
    loyaltyPoints: 185,
    stock: {
      "Boutique Plateau": 45,
      "Boutique Parcelles": 32,
      "Boutique Almadies": 18,
    },
    status: "Actif",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 2,
    name: "Huile de Tournesol",
    category: "Huiles",
    weight: 5,
    price: 12.8,
    loyaltyPoints: 128,
    stock: {
      "Boutique Plateau": 8,
      "Boutique Parcelles": 15,
      "Boutique Almadies": 22,
    },
    status: "Stock faible",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 3,
    name: "Savon de Marseille Pack",
    category: "Hygiène",
    weight: 2.4,
    price: 15.6,
    loyaltyPoints: 156,
    stock: {
      "Boutique Plateau": 67,
      "Boutique Parcelles": 43,
      "Boutique Almadies": 29,
    },
    status: "Actif",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 4,
    name: "Pâtes Spaghetti Bio",
    category: "Pâtes",
    weight: 1,
    price: 4.2,
    loyaltyPoints: 42,
    stock: {
      "Boutique Plateau": 0,
      "Boutique Parcelles": 5,
      "Boutique Almadies": 12,
    },
    status: "Rupture",
    image: "/placeholder.svg?height=60&width=60",
  },
];

export default function ProductsPage() {

  const product = new ProductQuery();
  const productData = useQuery({
    queryKey: ["productFetchAll"],
    queryFn: () => product.getAll(),
  });
  const { setLoading } = useStore();
  React.useEffect(()=>{
    setLoading(productData.isLoading);
    if(productData.isSuccess){
      console.log("Products fetched successfully:", productData.data);
    }
  }, [productData.isSuccess, productData.isLoading, productData.data, setLoading]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actif":
        return "default";
      case "Stock faible":
        return "secondary";
      case "Rupture":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getTotalStock = (stock: Record<string, number>) => {
    return Object.values(stock).reduce((sum, qty) => sum + qty, 0);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: number, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    }
  };

  return (
    <PageLayout isLoading={productData.isLoading} className="flex-1 overflow-auto p-4 space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{"Filtres et actions"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap items-center">
            <div className="flex-1 min-w-[200px]">
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
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="Céréales">Céréales</SelectItem>
                <SelectItem value="Huiles">Huiles</SelectItem>
                <SelectItem value="Hygiène">Hygiène</SelectItem>
                <SelectItem value="Pâtes">Pâtes</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="Actif">Actif</SelectItem>
                <SelectItem value="Stock faible">Stock faible</SelectItem>
                <SelectItem value="Rupture">Rupture</SelectItem>
              </SelectContent>
            </Select>
            {selectedProducts.length > 0 && (
              <Dialog open={bulkEditOpen} onOpenChange={setBulkEditOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    {`Édition groupée (${selectedProducts.length})`}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{"Édition groupée"}</DialogTitle>
                    <DialogDescription>
                      {"Modifiez plusieurs produits en même temps"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bulk-category">{"Catégorie"}</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Changer la catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cereales">Céréales</SelectItem>
                          <SelectItem value="huiles">Huiles</SelectItem>
                          <SelectItem value="hygiene">Hygiène</SelectItem>
                          <SelectItem value="pates">Pâtes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="bulk-status">Statut</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Changer le statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="actif">Actif</SelectItem>
                          <SelectItem value="inactif">Inactif</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="bulk-discount">Remise (%)</Label>
                      <Input id="bulk-discount" type="number" placeholder="0" />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => setBulkEditOpen(false)}>
                        Appliquer les modifications
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setBulkEditOpen(false)}
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Produits ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedProducts.length === filteredProducts.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Produit</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Poids</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Points fidélité</TableHead>
                <TableHead>Stock total</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={(checked) =>
                        handleSelectProduct(product.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.weight}kg</TableCell>
                  <TableCell>€{product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      {product.loyaltyPoints}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">
                        {getTotalStock(product.stock)} unités
                      </p>
                      <div className="text-xs text-muted-foreground">
                        {Object.entries(product.stock).map(([store, qty]) => (
                          <div key={store} className="flex justify-between">
                            <span>{store.replace("Boutique ", "")}:</span>
                            <span className={qty < 10 ? "text-red-500" : ""}>
                              {qty}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(product.status)}>
                      {product.status === "Stock faible" && (
                        <AlertTriangle className="mr-1 h-3 w-3" />
                      )}
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingProduct(product);
                          setIsProductDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Modifier le produit" : "Nouveau produit"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? "Modifiez les informations du produit"
                : "Créez un nouveau produit"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informations générales</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="productName">Nom du produit</Label>
                  <Input
                    id="productName"
                    placeholder="Ex: Riz Brisé Premium"
                    defaultValue={editingProduct?.name || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productCategory">Catégorie</Label>
                  <Select defaultValue={editingProduct?.category || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Céréales">Céréales</SelectItem>
                      <SelectItem value="Huiles">Huiles</SelectItem>
                      <SelectItem value="Hygiène">Hygiène</SelectItem>
                      <SelectItem value="Pâtes">Pâtes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="productDescription">Description</Label>
                <Textarea
                  id="productDescription"
                  placeholder="Description détaillée du produit..."
                  defaultValue={editingProduct?.description || ""}
                />
              </div>
            </div>

            {/* Pricing & Weight */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Prix et poids</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="productWeight">Poids (kg)</Label>
                  <Input
                    id="productWeight"
                    type="number"
                    step="0.1"
                    placeholder="25"
                    defaultValue={editingProduct?.weight || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productPrice">Prix (MAD)</Label>
                  <Input
                    id="productPrice"
                    type="number"
                    step="0.01"
                    placeholder="18.50"
                    defaultValue={editingProduct?.price || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loyaltyPoints">Points fidélité</Label>
                  <Input
                    id="loyaltyPoints"
                    type="number"
                    placeholder="185"
                    defaultValue={editingProduct?.loyaltyPoints || ""}
                  />
                </div>
              </div>
            </div>

            {/* Stock Management */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Gestion du stock</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="stockPlateau">Stock Boutique Plateau</Label>
                  <Input
                    id="stockPlateau"
                    type="number"
                    placeholder="45"
                    defaultValue={
                      editingProduct?.stock?.["Boutique Plateau"] || ""
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stockParcelles">
                    Stock Boutique Parcelles
                  </Label>
                  <Input
                    id="stockParcelles"
                    type="number"
                    placeholder="32"
                    defaultValue={
                      editingProduct?.stock?.["Boutique Parcelles"] || ""
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stockAlmadies">Stock Boutique Almadies</Label>
                  <Input
                    id="stockAlmadies"
                    type="number"
                    placeholder="18"
                    defaultValue={
                      editingProduct?.stock?.["Boutique Almadies"] || ""
                    }
                  />
                </div>
              </div>
            </div>

            {/* Product Image */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Image du produit</h3>
              <div className="space-y-2">
                <Label htmlFor="productImage">Image</Label>
                <Input id="productImage" type="file" accept="image/*" />
                {editingProduct?.image && (
                  <div className="mt-2">
                    <img
                      src={editingProduct.image || "/placeholder.svg"}
                      alt="Aperçu"
                      className="h-20 w-20 rounded-md object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Statut</h3>
              <div className="space-y-2">
                <Label htmlFor="productStatus">Statut du produit</Label>
                <Select defaultValue={editingProduct?.status || "Actif"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Actif">Actif</SelectItem>
                    <SelectItem value="Inactif">Inactif</SelectItem>
                    <SelectItem value="Stock faible">Stock faible</SelectItem>
                    <SelectItem value="Rupture">Rupture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setIsProductDialogOpen(false)}>
                {editingProduct ? "Mettre à jour" : "Créer le produit"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsProductDialogOpen(false)}
              >
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
