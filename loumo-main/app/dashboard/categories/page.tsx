"use client";

import PageLayout from "@/components/page-layout";
import StatCard from "@/components/statistic-Card";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { Category, statisticCard } from "@/types/types";
import { ArrowDownAZ, ArrowUpAz, Edit, Eye, MoreHorizontal, Package, PlusCircle, Search, Tag, Trash } from "lucide-react";
import React, { useMemo, useState } from "react";
import AddCategory from "./add";
import DeleteCategory from "./delete";
import EditCategory from "./edit";


export default function CategoriesPage() {
  const { setLoading } = useStore();
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
  const [sortDirection, setSortDirection] = useState<string>();

  const filteredCategories = useMemo(()=>{
    return categories.sort((a,b)=> sortDirection === "asc" ? a.name.localeCompare(b.name, "fr") : sortDirection === "desc" ? b.name.localeCompare(a.name, "fr") : 0).filter((category) => {
    const matchesSearch = category.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()); //||
    //category.description?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch;
  });
  }, [sortDirection, categories, searchTerm]);

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setEditDialog(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialog(true);
  };

  const statistics:statisticCard[] = [
    {
      title: "Catégories",
      value: categories.length,
      icon: <Tag size={16} className="text-muted-foreground" />,
    },
    {
      title: "Catégories Actives",
      value: categories.filter(category=>!!category.status).length,
      icon: <Eye size={16} className="text-primary" />
    },
    {
      title: "Produits",
      value: categories.reduce((sum, cat) => sum + (cat.products?.length ?? 0),0),
      icon: <Package size={16} className="text-ternary" />
    },
    {
      title: "Catégorie sur la page d'accueil",
      value: categories.filter(cat=>!!cat.display).length,
      icon: <Tag size={16} className="text-blue-500" />
    }
  ];

  return (
    <PageLayout
      isLoading={getCategories.isLoading}
      className="flex-1 overflow-auto p-4 space-y-6"
    >
      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 @min-[540px]:grid-cols-2 @min-[860px]:grid-cols-3 @min-[1156px]:grid-cols-4">
        {statistics.map((item, id)=><StatCard key={id} {...item}/>)}
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>{"Filtres et actions"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex sm:items-end gap-2 flex-col sm:flex-row">
            <div className="space-y-2">
              <label className="text-sm font-medium">{"Recherche"}</label>
              <div className="relative w-full">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une catégorie"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{"Classer par ordre"}</label>
              <Select value={sortDirection} onValueChange={setSortDirection}>
                <SelectTrigger className="w-40">
                  {sortDirection === "asc" ? <ArrowDownAZ size={16}/> : <ArrowUpAz size={16}/>}
                  <SelectValue placeholder="Réordonner"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">{"A-Z"}</SelectItem>
                  <SelectItem value="desc">{"Z-A"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle size={16} /> {"Ajouter une catégorie"}
            </Button>
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
                <TableHead>{"Parent"}</TableHead>
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
                    colSpan={6}
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
                      {category.parentId ? categories.find(x=>x.id === category.parentId)?.name : "--"}
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
          categories={categories}
        />
      )}
      {selectedCategory && (
        <DeleteCategory
          category={selectedCategory}
          isOpen={deleteDialog}
          openChange={setDeleteDialog}
        />
      )}
      <AddCategory isOpen={isDialogOpen} openChange={setIsDialogOpen} categories={categories} />
    </PageLayout>
  );
}
