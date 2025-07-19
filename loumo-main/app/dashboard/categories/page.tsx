"use client";

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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
import { Category } from "@/types/types";
import { Edit, Eye, MoreHorizontal, PlusCircle, Search, Tag, Trash } from "lucide-react";
import React, { useState } from "react";
import AddCategory from "./add";
import DeleteCategory from "./delete";
import EditCategory from "./edit";


export default function CategoriesPage() {
  const { setLoading, addToast } = useStore();
  const categoryQuery = new CategoryQuery();
  const getCategories = fetchAll(categoryQuery.getAll,"categories");

  const [categories, setCategories] = useState<Category[]>([]);

  React.useEffect(() => {
    setLoading(getCategories.isLoading);
    if (getCategories.isSuccess) {
      setCategories(getCategories.data);
    }
  }, [
    getCategories.data,
    getCategories.isSuccess,
    getCategories.isLoading,
    setLoading,
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >();

  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()); //||
    //category.description?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch;
  });

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setEditDialog(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialog(true);
  };

  return (
    <PageLayout
      isLoading={getCategories.isLoading}
      className="flex-1 overflow-auto p-4 space-y-6"
    >
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Total Catégories"}
            </CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            {/* <p className="text-xs text-muted-foreground">+2 ce mois</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Catégories Actives"}
            </CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {categories.filter((c) => c.status).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {"Visibles sur le site"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Total Produits"}
            </CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.reduce(
                (sum, cat) => sum + (cat.products?.length ?? 0),
                0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {"Dans toutes les catégories"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Affichées sur l'accueil"}
            </CardTitle>
            <Tag className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {categories.filter((c) => !!c.display).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {"Visibles sur la page d'accueil"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>{"Filtres et actions"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex sm:items-center gap-2 flex-col sm:flex-row">
            <div className="relative w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une catégorie"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle size={16} /> {"Ajouter une catégorie"}
            </Button>
            <Button onClick={()=>{addToast({title: "Hello from toast", variant: "error"})}}>Toast button</Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>{"Liste des catégories"}</CardTitle>
          <CardDescription>
            {filteredCategories.length} {"catégorie(s) affichée(s)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{"Nom"}</TableHead>
                <TableHead>{"Produits"}</TableHead>
                <TableHead>{"Statut"}</TableHead>
                <TableHead>{"Page d'Accueil"}</TableHead>
                <TableHead>{"Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-gray-500 py-5 sm:text-lg xl:text-xl"
                  >
                    {"Aucune catégorie trouvée"}
                    <img
                      src={"/images/search.png"}
                      alt="no-img"
                      className="w-1/3 max-w-32 h-auto mx-auto mt-5 opacity-20"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <img
                            src={
                              !category.imgUrl
                                ? "/images/placeholder.svg"
                                : category.imgUrl.includes("http")
                                ? category.imgUrl
                                : `${process.env.NEXT_PUBLIC_API_BASE_URL}${category.imgUrl}`
                            }
                            alt={category.name}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        {category.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {category.products?.length ?? 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={!!category.status ? "default" : "outline"}
                      >
                        {!!category.status ? "Actif" : "Désactivé"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={!!category.display ? "default" : "outline"}
                      >
                        {!!category.display ? "Oui" : "Non"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant={"ghost"} size={"icon"}><MoreHorizontal size={16}/></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={()=>handleEdit(category)}>
                              <Edit size={16}/>
                            {"Modifier"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={()=>handleDelete(category)} variant="destructive">
                              <Trash size={16}/>
                            {"Supprimer"}
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
      {selectedCategory && (
        <EditCategory
          category={selectedCategory}
          isOpen={editDialog}
          openChange={setEditDialog}
        />
      )}
      {selectedCategory && (
        <DeleteCategory
          category={selectedCategory}
          isOpen={deleteDialog}
          openChange={setDeleteDialog}
        />
      )}
      <AddCategory isOpen={isDialogOpen} openChange={setIsDialogOpen} />
    </PageLayout>
  );
}
