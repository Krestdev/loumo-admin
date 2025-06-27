"use client";

import { DialogTrigger } from "@/components/ui/dialog";

import PageLayout from "@/components/page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useStore } from "@/providers/datastore";
import CategoryQuery from "@/queries/category";
import ProductQuery from "@/queries/product";
import { Category, Product } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatRelative, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import { Edit, PlusCircle, Search, Trash2 } from "lucide-react";
import React, { useMemo, useState } from "react";
import EditProduct from "./edit";
import AddProduct from "./add";

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [deletingProductId, setDeletingProductId] = useState<number | null>(
    null
  );
  const product = new ProductQuery();
  const category = new CategoryQuery();
  const productData = useQuery({
    queryKey: ["products"],
    queryFn: () => product.getAll(),
    refetchOnWindowFocus: false,
  });
  const categoryData = useQuery({
    queryKey: ["categories"],
    queryFn: () => category.getAll(),
    refetchOnWindowFocus: false,
  });
  const deleteProduct = useMutation({
    mutationFn: (id: number) => product.delete(id),
    onMutate: (id) => {
      setDeletingProductId(id);
    },
    onSettled: () => {
      setDeletingProductId(null); // reset after success or error
      queryClient.invalidateQueries({
        queryKey: ["products"],
        refetchType: "active",
      });
    },
  });
  const { setLoading } = useStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  React.useEffect(() => {
    setLoading(productData.isLoading || categoryData.isLoading);
    if (productData.isSuccess && categoryData.isSuccess) {
      setProducts(productData.data);
      setCategories(categoryData.data);
    }
  }, [
    productData.isLoading,
    categoryData.isLoading,
    setLoading,
    categoryData.isSuccess,
    categoryData.data,
    productData.data,
    productData.isSuccess,
  ]);

  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesSearch = product?.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesCategory =
          categoryFilter === "all" ||
          product.categoryId ===
            categories.find((x) => x.name === categoryFilter)?.id;
        const matchesStatus =
          statusFilter === "all" || String(product.status) === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
      }),
    [products, categories, searchTerm, statusFilter, categoryFilter]
  );

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
    <PageLayout
      isLoading={productData.isLoading}
      className="flex-1 overflow-auto p-4 space-y-6"
    >
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
                <SelectItem value="all">{"Tous"}</SelectItem>
                {categories
                  .filter((x) => x.products && x.products.length > 0)
                  .map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{"Tous"}</SelectItem>
                <SelectItem value="true">{"Actif"}</SelectItem>
                <SelectItem value="false">{"Désactivé"}</SelectItem>
              </SelectContent>
            </Select>
            {/**Add Product */}
            <Button onClick={()=>{setIsAddDialogOpen(true)}}>
              <PlusCircle size={16} /> {"Ajouter un produit"}
            </Button>
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
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.name}>
                              {cat.name}
                            </SelectItem>
                          ))}
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
                          <SelectItem value="true">Actif</SelectItem>
                          <SelectItem value="false">Inactif</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="bulk-discount">Remise (%)</Label>
                      <Input id="bulk-discount" type="number" placeholder="0" />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => setBulkEditOpen(false)}>
                        {"Appliquer les modifications"}
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
          <CardTitle>{`Produits (${filteredProducts.length})`}</CardTitle>
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
                <TableHead>{"Produit"}</TableHead>
                <TableHead>{"Catégorie"}</TableHead>
                <TableHead>{"Variants"}</TableHead>
                <TableHead>{"Statut"}</TableHead>
                <TableHead>{"Modifié le"}</TableHead>
                <TableHead>{"Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-gray-500 space-y-2 pt-5 sm:text-lg xl:text-xl"
                  >
                    {"Aucun produit trouvé"}
                    <img
                      src={"/images/no-order.png"}
                      className="w-1/3 max-w-60 h-auto mx-auto opacity-50"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
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
                      <p className="font-medium">{product.name}</p>
                    </TableCell>
                    <TableCell>
                      {
                        categories.find((x) => x.id === product.categoryId)
                          ?.name
                      }
                    </TableCell>
                    <TableCell>
                      {product.variants && product.variants.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {product.variants.map((x) => (
                            <Badge key={x.id} variant={"outline"}>
                              {x.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.status ? "default" : "destructive"}
                      >
                        {product.status ? "Actif" : "Désactivé"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatRelative(
                        subDays(new Date(product.updatedAt), 2),
                        new Date(),
                        {
                          locale: fr,
                        }
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingProduct(product);
                            setIsEditDialogOpen(true);
                          }}
                          disabled={deletingProductId === product.id}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            deleteProduct.mutate(product.id);
                          }}
                          disabled={deletingProductId === product.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Product Dialog */}
      <AddProduct
        isOpen={isAddDialogOpen}
        openChange={setIsAddDialogOpen}
        categories={categories}
      />
      {editingProduct && (
        <EditProduct
          product={editingProduct}
          isOpen={isEditDialogOpen}
          openChange={setIsEditDialogOpen}
          categories={categories}
        />
      )}
    </PageLayout>
  );
}
