"use client";

import PageLayout from "@/components/page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { fetchAll } from "@/hooks/useData";
import { useStore } from "@/providers/datastore";
import CategoryQuery from "@/queries/category";
import ProductQuery from "@/queries/product";
import { Category, Product, Shop } from "@/types/types";
import { formatRelative } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowDownAZ, ArrowUpAz, Edit, MoreHorizontal, PlusCircle, Search, Trash2 } from "lucide-react";
import React, { useMemo, useState } from "react";
import AddProduct from "./add";
import DeleteProduct from "./delete";
import EditProduct from "./edit";
import GroupDelete from "./groupDelete";
import GroupEdit from "./groupEdit";
import ShopQuery from "@/queries/shop";

export default function ProductsPage() {

  const product = new ProductQuery();
  const category = new CategoryQuery();
  const shopQuery = new ShopQuery();
  const productData = fetchAll(product.getAll,"products");
  const categoryData = fetchAll(category.getAll,"categories");
  const shopsData = fetchAll(shopQuery.getAll, "shops");

  const { setLoading } = useStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  React.useEffect(() => {
    setLoading(productData.isLoading || categoryData.isLoading || shopsData.isLoading);
    if (productData.isSuccess) {
      setProducts(productData.data);
    }
    if (categoryData.isSuccess) {
      setCategories(categoryData.data);
    }
    if (shopsData.isSuccess) {
      setShops(shopsData.data);
    }
  }, [
    productData.isLoading,
    categoryData.isLoading,
    shopsData.isLoading,
    setLoading,
    categoryData.isSuccess,
    categoryData.data,
    productData.data,
    productData.isSuccess,
    shopsData.data,
    shopsData.isSuccess,
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
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [shops, setShops] = useState<Shop[]>([]);
  const [sortDirection, setSortDirection] = useState<string>("asc");

  const filteredProducts = useMemo(
    () =>
      products.sort((a,b)=> sortDirection === "asc" ? a.name.localeCompare(b.name, "fr") : b.name.localeCompare(a.name, "fr")).filter((product) => {
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
    [products, categories, searchTerm, statusFilter, categoryFilter, sortDirection]
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

  const handleEdit = (product:Product):void => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  }

  const handleAdd = ():void => {
    setIsAddDialogOpen(true);
  }
  const handleDelete = (product: Product):void =>{
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  }

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
            <Select value={sortDirection} onValueChange={setSortDirection}>
              <SelectTrigger className="w-32">
                {sortDirection === "asc" ? <ArrowDownAZ size={16}/> : <ArrowUpAz size={16}/>}
                <SelectValue placeholder="Arranger par ordre alphabétique"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">{"A-Z"}</SelectItem>
                <SelectItem value="desc">{"Z-A"}</SelectItem>
              </SelectContent>
            </Select>
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
              <Button onClick={()=>handleAdd()}>
                <PlusCircle size={16} /> {"Ajouter un produit"}
              </Button>
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
                      alt="no-image"
                      className="w-1/3 max-w-32 h-auto mx-auto mt-5 opacity-20"
                    />
                    <Button size={"lg"} onClick={()=>handleAdd()} className="my-5">
                <PlusCircle size={16} /> {"Ajouter un produit"}
              </Button>
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant={"ghost"} size={"icon"}>
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>handleEdit(product)}
                          >
                            <Edit size={16} />
                            {"Modifier le produit"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() =>handleDelete(product)}
                          >
                            <Trash2 size={16} />
                            {"Supprimer le produit"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
        shops={shops}
      />
      {selectedProduct && (
        <DeleteProduct
          product={selectedProduct}
          isOpen={isDeleteDialogOpen}
          openChange={setIsDeleteDialogOpen}
        />
      )}
      {selectedProduct && (
        <EditProduct
          product={selectedProduct}
          isOpen={isEditDialogOpen}
          openChange={setIsEditDialogOpen}
          categories={categories}
        />
      )}
    </PageLayout>
  );
}
