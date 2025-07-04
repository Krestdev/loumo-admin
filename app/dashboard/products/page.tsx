"use client";

import PageLayout from "@/components/page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useStore } from "@/providers/datastore";
import CategoryQuery from "@/queries/category";
import ProductQuery from "@/queries/product";
import { Category, Product } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { formatRelative, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import { Edit, PlusCircle, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import AddProduct from "./add";
import DeleteProduct from "./delete";
import EditProduct from "./edit";
import GroupDelete from "./groupDelete";
import GroupEdit from "./groupEdit";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const open = searchParams.get("open");
  React.useEffect(() => {
    if (open === "add") {
      router.replace("/dashboard/products/add");
    }
  }, [open]);

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
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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
            <Link href={"/dashboard/products/add"}>
              <Button /* onClick={()=>{setIsAddDialogOpen(true)}} */>
                <PlusCircle size={16} /> {"Ajouter un produit"}
              </Button>
            </Link>
            {selectedProducts.length > 0 && (
              <div className="flex gap-2">
                <Select defaultValue="edit">
                  <SelectTrigger className="w-fit">
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="edit"
                      onClick={() => setBulkEditOpen(true)}
                    >{`Édition groupée (${selectedProducts.length})`}</SelectItem>
                    <SelectItem
                      value="delete"
                      onClick={() => setBulkDeleteOpen(true)}
                    >{`Suppression groupée (${selectedProducts.length})`}</SelectItem>
                  </SelectContent>
                </Select>
                {/* <Button variant="outline" onClick={() => setBulkEditOpen(true)}>
                      <Edit className="mr-2" size={16} />
                      {`Édition groupée (${selectedProducts.length})`}
                    </Button>
                <Button variant="outline" onClick={() => setBulkDeleteOpen(true)}>
                      <Trash2 className="mr-2" size={16} />
                      {`Édition groupée (${selectedProducts.length})`}
                    </Button> */}
              </div>
            )}
            <GroupEdit
              isOpen={bulkEditOpen}
              openChange={setBulkEditOpen}
              ids={selectedProducts}
              categories={categories}
            />
            <GroupDelete
              isOpen={bulkDeleteOpen}
              openChange={setBulkDeleteOpen}
              ids={selectedProducts}
            />
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
                    className="text-center text-gray-500 space-y-2 py-5 sm:text-lg xl:text-xl"
                  >
                    {"Aucun produit trouvé"}
                    <img
                      src={"/images/search.png"}
                      className="w-1/3 max-w-32 h-auto mx-auto mt-5 opacity-20"
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
                      {!product.variants ||
                        (product.variants && product.variants.length === 0 && (
                          <p className="text-muted-foreground">{"Aucun"}</p>
                        ))}
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
                        new Date(product.updatedAt), // ✅ date réelle
                        new Date(), // maintenant
                        { locale: fr }
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setEditingProduct(product);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="delete"
                          size="icon"
                          onClick={() => {
                            setEditingProduct(product);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 size={16} />
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
        <DeleteProduct
          product={editingProduct}
          isOpen={isDeleteDialogOpen}
          openChange={setIsDeleteDialogOpen}
        />
      )}
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
