"use client"

import PageLayout from "@/components/page-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useStore } from "@/providers/datastore"
import CategoryQuery from "@/queries/category"
import { Category } from "@/types/types"
import { useQuery } from "@tanstack/react-query"
import { Edit, Eye, PlusCircle, Search, Tag, Trash2 } from "lucide-react"
import React from "react"
import { useState } from "react"
import DeleteCategory from "./delete"
import EditCategory from "./edit"
import AddCategory from "./add"

const categoriesData = [
  {
    id: 1,
    name: "Céréales & Légumineuses",
    description: "Riz, blé, lentilles, haricots et autres céréales en vrac",
    productCount: 45,
    isActive: true,
    showOnHomepage: true,
    parentId: null,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Huiles & Condiments",
    description: "Huiles d'olive, tournesol, épices et condiments",
    productCount: 32,
    isActive: true,
    showOnHomepage: false,
    parentId: null,
    createdAt: "2024-01-16",
  },
  {
    id: 3,
    name: "Produits d'Hygiène",
    description: "Savons, détergents, produits de nettoyage",
    productCount: 28,
    isActive: true,
    showOnHomepage: true,
    parentId: null,
    createdAt: "2024-01-17",
  },
  {
    id: 11,
    name: "Riz",
    description: "Différentes variétés de riz",
    productCount: 15,
    isActive: true,
    showOnHomepage: false,
    parentId: 1,
    createdAt: "2024-01-18",
  },
  {
    id: 12,
    name: "Légumineuses",
    description: "Lentilles, haricots, pois chiches",
    productCount: 18,
    isActive: true,
    showOnHomepage: false,
    parentId: 1,
    createdAt: "2024-01-19",
  },
]

export default function CategoriesPage() {

  const { setLoading } = useStore();
  const categoryQuery = new CategoryQuery();
  const getCategories = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryQuery.getAll(),
    refetchOnWindowFocus: false
  })

  const [categories, setCategories] = useState<Category[]>([]);

  React.useEffect(()=>{
    setLoading(getCategories.isLoading);
    if(getCategories.isSuccess){
      setCategories(getCategories.data)
    }
  }, [getCategories.data, getCategories.isSuccess, getCategories.isLoading, setLoading])

  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) //||
      //category.description?.toLowerCase().includes(searchTerm.toLowerCase())


    return matchesSearch
  })

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setEditDialog(true)
  }

  const handleDelete = (category:Category) => {
    setSelectedCategory(category)
    setDeleteDialog(true)
  }

  return (
      <PageLayout isLoading={getCategories.isLoading} className="flex-1 overflow-auto p-4 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{"Total Catégories"}</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
              {/* <p className="text-xs text-muted-foreground">+2 ce mois</p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{"Catégories Actives"}</CardTitle>
              <Eye className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{categories.filter((c) => c.status).length}</div>
              <p className="text-xs text-muted-foreground">{"Visibles sur le site"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{"Total Produits"}</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.reduce((sum, cat) => sum + (cat.products?.length ?? 0), 0)}</div>
              <p className="text-xs text-muted-foreground">{"Dans toutes les catégories"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Affichées sur l'accueil</CardTitle>
              <Tag className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {categoriesData.filter((c) => c.showOnHomepage).length}
              </div>
              <p className="text-xs text-muted-foreground">Visibles sur la page d'accueil</p>
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
                <Button onClick={()=>setIsDialogOpen(true)}><PlusCircle size={16} className="mr-2"/> {"Ajouter"}</Button>
            </div>
          </CardContent>
        </Card>

        {/* Categories Table */}
        <Card>
          <CardHeader>
            <CardTitle>{"Liste des catégories"}</CardTitle>
            <CardDescription>{filteredCategories.length} {"catégorie(s) affichée(s)"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{"Nom"}</TableHead>
                  <TableHead>{"Produits"}</TableHead>
                  <TableHead>{"Statut"}</TableHead>
                  <TableHead>{"Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{category.products?.length ?? 0}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={category.status ? "default" : "secondary"}>
                        {category.status ? "Actif" : "Désactivé"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(category)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={()=>{handleDelete(category)}}>
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
        {selectedCategory && <EditCategory category={selectedCategory} isOpen={editDialog} openChange={setEditDialog} />}
        {selectedCategory && <DeleteCategory category={selectedCategory} isOpen={deleteDialog} openChange={setDeleteDialog} />}
        <AddCategory isOpen={isDialogOpen} openChange={setIsDialogOpen}/>
      </PageLayout>
  )
}
