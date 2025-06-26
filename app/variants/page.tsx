"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Search, Plus, Edit, Trash2, Layers, Package, Weight, Palette } from "lucide-react"

const variants = [
  {
    id: 1,
    productName: "Riz Brisé Premium",
    productId: 1,
    name: "5kg",
    type: "Poids",
    value: "5",
    unit: "kg",
    price: 12.5,
    priceAdjustment: 0,
    stock: {
      "Boutique Plateau": 45,
      "Boutique Parcelles": 32,
      "Boutique Almadies": 18,
    },
    sku: "RIZ-BRISE-5KG",
    barcode: "1234567890123",
    isDefault: false,
    isActive: true,
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 2,
    productName: "Riz Brisé Premium",
    productId: 1,
    name: "25kg",
    type: "Poids",
    value: "25",
    unit: "kg",
    price: 18.5,
    priceAdjustment: 6.0,
    stock: {
      "Boutique Plateau": 23,
      "Boutique Parcelles": 15,
      "Boutique Almadies": 8,
    },
    sku: "RIZ-BRISE-25KG",
    barcode: "1234567890124",
    isDefault: true,
    isActive: true,
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 3,
    productName: "Huile de Tournesol",
    productId: 2,
    name: "1L",
    type: "Volume",
    value: "1",
    unit: "L",
    price: 5.6,
    priceAdjustment: 0,
    stock: {
      "Boutique Plateau": 67,
      "Boutique Parcelles": 43,
      "Boutique Almadies": 29,
    },
    sku: "HUILE-TOUR-1L",
    barcode: "2345678901234",
    isDefault: true,
    isActive: true,
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 4,
    productName: "Huile de Tournesol",
    productId: 2,
    name: "5L",
    type: "Volume",
    value: "5",
    unit: "L",
    price: 12.8,
    priceAdjustment: 2.2,
    stock: {
      "Boutique Plateau": 8,
      "Boutique Parcelles": 15,
      "Boutique Almadies": 22,
    },
    sku: "HUILE-TOUR-5L",
    barcode: "2345678901235",
    isDefault: false,
    isActive: true,
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 5,
    productName: "Savon de Marseille",
    productId: 3,
    name: "Pack de 6",
    type: "Quantité",
    value: "6",
    unit: "pièces",
    price: 8.4,
    priceAdjustment: 0,
    stock: {
      "Boutique Plateau": 34,
      "Boutique Parcelles": 28,
      "Boutique Almadies": 19,
    },
    sku: "SAVON-MARS-6P",
    barcode: "3456789012345",
    isDefault: true,
    isActive: true,
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 6,
    productName: "Savon de Marseille",
    productId: 3,
    name: "Pack de 12",
    type: "Quantité",
    value: "12",
    unit: "pièces",
    price: 15.6,
    priceAdjustment: -1.2,
    stock: {
      "Boutique Plateau": 33,
      "Boutique Parcelles": 15,
      "Boutique Almadies": 10,
    },
    sku: "SAVON-MARS-12P",
    barcode: "3456789012346",
    isDefault: false,
    isActive: true,
    image: "/placeholder.svg?height=60&width=60",
  },
]

const variantTypes = [
  { id: "Poids", name: "Poids", icon: Weight, units: ["g", "kg"] },
  { id: "Volume", name: "Volume", icon: Package, units: ["ml", "L"] },
  { id: "Quantité", name: "Quantité", icon: Layers, units: ["pièces", "unités"] },
  { id: "Couleur", name: "Couleur", icon: Palette, units: [] },
]

export default function VariantsPage() {
  const [selectedVariant, setSelectedVariant] = useState(variants[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [productFilter, setProductFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVariant, setEditingVariant] = useState<any>(null)
  const [isUnitsDialogOpen, setIsUnitsDialogOpen] = useState(false)
  const [isTypesDialogOpen, setIsTypesDialogOpen] = useState(false)

  const filteredVariants = variants.filter((variant) => {
    const matchesSearch =
      variant.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variant.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || variant.type === typeFilter
    const matchesProduct = productFilter === "all" || variant.productId.toString() === productFilter
    return matchesSearch && matchesType && matchesProduct
  })

  const getTotalStock = (stock: Record<string, number>) => {
    return Object.values(stock).reduce((sum, qty) => sum + qty, 0)
  }

  const getTypeIcon = (type: string) => {
    const variantType = variantTypes.find((vt) => vt.id === type)
    return variantType?.icon || Package
  }

  const handleEdit = (variant: any) => {
    setEditingVariant(variant)
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingVariant(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="flex h-screen flex-col">
      <main className="flex-1 overflow-auto p-4 space-y-6">
        {/* Variant Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total variantes</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{variants.length}</div>
              <p className="text-xs text-muted-foreground">{variants.filter((v) => v.isActive).length} actives</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produits avec variantes</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Set(variants.map((v) => v.productId)).size}</div>
              <p className="text-xs text-muted-foreground">Produits configurés</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Types de variantes</CardTitle>
              <Weight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{variantTypes.length}</div>
              <p className="text-xs text-muted-foreground">Types disponibles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock total</CardTitle>
              <Package className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {variants.reduce((sum, variant) => sum + getTotalStock(variant.stock), 0)}
              </div>
              <p className="text-xs text-muted-foreground">Unités en stock</p>
            </CardContent>
          </Card>
        </div>

        {/* Variant Types Overview */}
        <Card>
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
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtres</CardTitle>
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
              <Select value={typeFilter} onValueChange={setTypeFilter}>
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
              </Select>
              <Select value={productFilter} onValueChange={setProductFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Produit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les produits</SelectItem>
                  {Array.from(new Set(variants.map((v) => ({ id: v.productId, name: v.productName })))).map(
                    (product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.name}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Variants Table */}
        <Card>
          <CardHeader>
            <CardTitle>Variantes ({filteredVariants.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>Variante</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVariants.map((variant) => {
                  const TypeIcon = getTypeIcon(variant.type)
                  return (
                    <TableRow key={variant.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={variant.image || "/placeholder.svg"}
                            alt={variant.productName}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                          <div>
                            <p className="font-medium">{variant.productName}</p>
                            {variant.isDefault && (
                              <Badge variant="outline" className="text-xs">
                                Par défaut
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{variant.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {variant.value} {variant.unit}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <TypeIcon className="h-4 w-4" />
                          <span>{variant.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">€{variant.price.toFixed(2)}</p>
                          {variant.priceAdjustment !== 0 && (
                            <p className="text-sm text-muted-foreground">
                              {variant.priceAdjustment > 0 ? "+" : ""}€{variant.priceAdjustment.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="bg-muted px-2 py-1 rounded text-sm">{variant.sku}</code>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{getTotalStock(variant.stock)} unités</p>
                          <div className="text-xs text-muted-foreground">
                            {Object.entries(variant.stock).map(([store, qty]) => (
                              <div key={store} className="flex justify-between">
                                <span>{store.replace("Boutique ", "")}:</span>
                                <span className={qty < 10 ? "text-red-500" : ""}>{qty}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={variant.isActive ? "default" : "secondary"}>
                          {variant.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedVariant(variant)}>
                                Voir
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Détails de la variante</DialogTitle>
                                <DialogDescription>
                                  {selectedVariant.productName} - {selectedVariant.name}
                                </DialogDescription>
                              </DialogHeader>

                              <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                  <img
                                    src={selectedVariant.image || "/placeholder.svg"}
                                    alt={selectedVariant.productName}
                                    className="h-20 w-20 rounded-md object-cover"
                                  />
                                  <div>
                                    <h3 className="text-lg font-medium">{selectedVariant.productName}</h3>
                                    <p className="text-muted-foreground">{selectedVariant.name}</p>
                                    <div className="flex gap-2 mt-2">
                                      {selectedVariant.isDefault && (
                                        <Badge variant="default">Variante par défaut</Badge>
                                      )}
                                      <Badge variant={selectedVariant.isActive ? "default" : "secondary"}>
                                        {selectedVariant.isActive ? "Active" : "Inactive"}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <h4 className="font-medium mb-2">Informations produit</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span>Type de variante:</span>
                                        <span>{selectedVariant.type}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Valeur:</span>
                                        <span>
                                          {selectedVariant.value} {selectedVariant.unit}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>SKU:</span>
                                        <code className="bg-muted px-1 rounded">{selectedVariant.sku}</code>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Code-barres:</span>
                                        <span>{selectedVariant.barcode}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-medium mb-2">Prix et stock</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span>Prix de vente:</span>
                                        <span className="font-medium">€{selectedVariant.price.toFixed(2)}</span>
                                      </div>
                                      {selectedVariant.priceAdjustment !== 0 && (
                                        <div className="flex justify-between">
                                          <span>Ajustement prix:</span>
                                          <span
                                            className={
                                              selectedVariant.priceAdjustment > 0 ? "text-green-600" : "text-red-600"
                                            }
                                          >
                                            {selectedVariant.priceAdjustment > 0 ? "+" : ""}€
                                            {selectedVariant.priceAdjustment.toFixed(2)}
                                          </span>
                                        </div>
                                      )}
                                      <div className="flex justify-between">
                                        <span>Stock total:</span>
                                        <span className="font-medium">{getTotalStock(selectedVariant.stock)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">Stock par boutique</h4>
                                  <div className="grid gap-2 md:grid-cols-3">
                                    {Object.entries(selectedVariant.stock).map(([store, qty]) => (
                                      <div key={store} className="p-3 border rounded-lg">
                                        <p className="font-medium text-sm">{store}</p>
                                        <p className={`text-lg ${qty < 10 ? "text-red-600" : "text-green-600"}`}>
                                          {qty} unités
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <Button onClick={() => handleEdit(selectedVariant)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Modifier
                                  </Button>
                                  <Button variant="outline">Dupliquer</Button>
                                  <Button variant="outline">Gérer stock</Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(variant)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
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

        {/* Add/Edit Variant Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingVariant ? "Modifier la variante" : "Nouvelle variante"}</DialogTitle>
              <DialogDescription>
                {editingVariant ? "Modifiez les informations de la variante" : "Créez une nouvelle variante de produit"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="product">Produit parent</Label>
                  <Select defaultValue={editingVariant?.productId?.toString() || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un produit" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(new Set(variants.map((v) => ({ id: v.productId, name: v.productName })))).map(
                        (product) => (
                          <SelectItem key={product.id} value={product.id.toString()}>
                            {product.name}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de la variante</Label>
                  <Input id="name" placeholder="Ex: 5kg" defaultValue={editingVariant?.name || ""} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="type">Type de variante</Label>
                  <Select defaultValue={editingVariant?.type || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      {variantTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Valeur</Label>
                  <Input id="value" placeholder="5" defaultValue={editingVariant?.value || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unité</Label>
                  <Select defaultValue={editingVariant?.unit || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Unité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="g">g</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="pièces">pièces</SelectItem>
                      <SelectItem value="unités">unités</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Prix de vente (€)</Label>
                  <Input id="price" type="number" step="0.01" defaultValue={editingVariant?.price || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceAdjustment">Ajustement prix (€)</Label>
                  <Input
                    id="priceAdjustment"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    defaultValue={editingVariant?.priceAdjustment || ""}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" placeholder="RIZ-BRISE-5KG" defaultValue={editingVariant?.sku || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barcode">Code-barres</Label>
                  <Input id="barcode" placeholder="1234567890123" defaultValue={editingVariant?.barcode || ""} />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Stock par boutique</Label>
                <div className="grid gap-4 md:grid-cols-3">
                  {["Boutique Plateau", "Boutique Parcelles", "Boutique Almadies"].map((store) => (
                    <div key={store} className="space-y-2">
                      <Label htmlFor={store}>{store}</Label>
                      <Input
                        id={store}
                        type="number"
                        placeholder="0"
                        defaultValue={editingVariant?.stock?.[store] || ""}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch id="isDefault" defaultChecked={editingVariant?.isDefault ?? false} />
                  <Label htmlFor="isDefault">Variante par défaut</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="isActive" defaultChecked={editingVariant?.isActive ?? true} />
                  <Label htmlFor="isActive">Variante active</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setIsDialogOpen(false)}>
                  {editingVariant ? "Mettre à jour" : "Créer la variante"}
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog Gestion des Unités */}
        <Dialog open={isUnitsDialogOpen} onOpenChange={setIsUnitsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Gestion des unités</DialogTitle>
              <DialogDescription>Ajoutez ou modifiez les unités disponibles</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {variantTypes.map((type) => (
                <div key={type.id} className="space-y-2">
                  <Label>{type.name}</Label>
                  <div className="flex gap-2 flex-wrap">
                    {type.units.map((unit) => (
                      <Badge key={unit} variant="outline">
                        {unit}
                      </Badge>
                    ))}
                    <Button variant="outline" size="sm">
                      + Ajouter
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog Gestion des Types */}
        <Dialog open={isTypesDialogOpen} onOpenChange={setIsTypesDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Gestion des types de variantes</DialogTitle>
              <DialogDescription>Créez de nouveaux types de variantes</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newTypeName">Nom du type</Label>
                <Input id="newTypeName" placeholder="Ex: Taille" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newTypeUnits">Unités (séparées par des virgules)</Label>
                <Input id="newTypeUnits" placeholder="Ex: S, M, L, XL" />
              </div>
              <Button>Ajouter le type</Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
