"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Search, Plus, Edit, Trash2, Tag, Eye } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [typeFilter, setTypeFilter] = useState("all") // "all", "main", "sub"

  const filteredCategories = categoriesData.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "main" && !category.parentId) ||
      (typeFilter === "sub" && category.parentId)

    return matchesSearch && matchesType
  })

  const handleEdit = (category: any) => {
    setEditingCategory(category)
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingCategory(null)
    setIsDialogOpen(true)
  }

  return (
      <main className="flex-1 overflow-auto p-4 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Catégories</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categoriesData.length}</div>
              <p className="text-xs text-muted-foreground">+2 ce mois</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Catégories Actives</CardTitle>
              <Eye className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{categoriesData.filter((c) => c.isActive).length}</div>
              <p className="text-xs text-muted-foreground">Visibles sur le site</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categoriesData.reduce((sum, cat) => sum + cat.productCount, 0)}</div>
              <p className="text-xs text-muted-foreground">Dans toutes les catégories</p>
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
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une catégorie ou headline..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardContent>
        </Card>

        {/* Type Filter */}
        <Card>
          <CardHeader>
            <CardTitle>{"Filtrer par type"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                variant={typeFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter("all")}
              >
                {"Toutes"} ({categoriesData.length})
              </Button>
              <Button
                variant={typeFilter === "main" ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter("main")}
              >
                {"Catégories principales"} ({categoriesData.filter((c) => !c.parentId).length})
              </Button>
              <Button
                variant={typeFilter === "sub" ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter("sub")}
              >
                {"Sous-catégories"} ({categoriesData.filter((c) => c.parentId).length})
              </Button>
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
                  <TableHead>{"Type"}</TableHead>
                  <TableHead>{"Description"}</TableHead>
                  <TableHead>{"Produits"}</TableHead>
                  <TableHead>{"Statut"}</TableHead>
                  <TableHead>{"Page d'accueil"}</TableHead>
                  <TableHead>{"Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.parentId && <span className="text-muted-foreground mr-2">└─</span>}
                      {category.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant={category.parentId ? "secondary" : "default"}>
                        {category.parentId ? "Sous-catégorie" : "Catégorie"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{category.productCount}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={category.isActive ? "default" : "secondary"}>
                        {category.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={category.showOnHomepage ? "default" : "outline"}>
                        {category.showOnHomepage ? "Oui" : "Non"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
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

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}</DialogTitle>
              <DialogDescription>
                {editingCategory
                  ? "Modifiez les informations de la catégorie"
                  : "Créez une nouvelle catégorie de produits"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">{"Nom de la catégorie"}</Label>
                <Input id="name" defaultValue={editingCategory?.name || ""} placeholder="Ex: Céréales & Légumineuses" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="parentCategory">{"Catégorie parent (optionnel)"}</Label>
                <Select defaultValue={editingCategory?.parentId?.toString() || "none"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie parent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{"Aucune (Catégorie principale)"}</SelectItem>
                    {categoriesData
                      .filter((cat) => !cat.parentId && cat.id !== editingCategory?.id)
                      .map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {"Sélectionner une catégorie parent créera une sous-catégorie"}
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">{"Description"}</Label>
                <Textarea
                  id="description"
                  defaultValue={editingCategory?.description || ""}
                  placeholder="Description détaillée de la catégorie..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="active" defaultChecked={editingCategory?.isActive ?? true} />
                <Label htmlFor="active">{"Catégorie active"}</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="showOnHomepage" defaultChecked={editingCategory?.showOnHomepage ?? false} />
                <Label htmlFor="showOnHomepage">{"Afficher sur la page d'accueil"}</Label>
                <p className="text-xs text-muted-foreground ml-2">{"(Uniquement pour les catégories principales)"}</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                {"Annuler"}
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>{editingCategory ? "Modifier" : "Créer"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
  )
}
