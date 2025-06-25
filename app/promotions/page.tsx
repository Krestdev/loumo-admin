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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Search, Plus, Edit, Trash2, Gift, Percent, Target } from "lucide-react"

const promotions = [
  {
    id: 1,
    name: "Promo Ramadan 2024",
    description: "Réduction sur tous les produits alimentaires",
    type: "Pourcentage",
    value: 15,
    code: "RAMADAN2024",
    startDate: "2024-03-10",
    endDate: "2024-04-10",
    status: "Actif",
    usageCount: 156,
    usageLimit: 1000,
    minAmount: 50,
    categories: ["Céréales", "Huiles"],
    customers: "Tous",
  },
  {
    id: 2,
    name: "Livraison Gratuite",
    description: "Frais de livraison offerts pour les commandes de plus de 75€",
    type: "Livraison gratuite",
    value: 0,
    code: "FREEDELIVERY",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "Actif",
    usageCount: 89,
    usageLimit: null,
    minAmount: 75,
    categories: ["Toutes"],
    customers: "Tous",
  },
  {
    id: 3,
    name: "Nouveau Client -20%",
    description: "Réduction de 20% pour les nouveaux clients",
    type: "Pourcentage",
    value: 20,
    code: "WELCOME20",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "Actif",
    usageCount: 45,
    usageLimit: null,
    minAmount: 30,
    categories: ["Toutes"],
    customers: "Nouveaux clients",
  },
  {
    id: 4,
    name: "Black Friday 2023",
    description: "Méga promotion Black Friday",
    type: "Montant fixe",
    value: 25,
    code: "BLACKFRIDAY23",
    startDate: "2023-11-24",
    endDate: "2023-11-26",
    status: "Expiré",
    usageCount: 234,
    usageLimit: 500,
    minAmount: 100,
    categories: ["Toutes"],
    customers: "Tous",
  },
  {
    id: 5,
    name: "Fidélité VIP",
    description: "Réduction exclusive pour les clients VIP",
    type: "Pourcentage",
    value: 10,
    code: "VIP10",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "Actif",
    usageCount: 67,
    usageLimit: null,
    minAmount: 0,
    categories: ["Toutes"],
    customers: "Clients VIP",
  },
]

export default function PromotionsPage() {
  const [selectedPromotion, setSelectedPromotion] = useState(promotions[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<any>(null)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [newClientPeriod, setNewClientPeriod] = useState(30)
  const [usageLimitPerClient, setUsageLimitPerClient] = useState("")
  const [categorySearch, setCategorySearch] = useState("")
  const [maxAmount, setMaxAmount] = useState("")
  const [selectedType, setSelectedType] = useState("")

  const filteredPromotions = promotions.filter((promotion) => {
    const matchesSearch =
      promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || promotion.status === statusFilter
    const matchesType = typeFilter === "all" || promotion.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actif":
        return "default"
      case "Programmé":
        return "secondary"
      case "Expiré":
        return "destructive"
      case "Suspendu":
        return "outline"
      default:
        return "outline"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Pourcentage":
        return "default"
      case "Montant fixe":
        return "secondary"
      case "Livraison gratuite":
        return "outline"
      default:
        return "outline"
    }
  }

  const handleEdit = (promotion: any) => {
    setEditingPromotion(promotion)
    setStartDate(new Date(promotion.startDate))
    setEndDate(new Date(promotion.endDate))
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingPromotion(null)
    setStartDate(undefined)
    setEndDate(undefined)
    setIsDialogOpen(true)
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Gestion des promotions</h1>
            <p className="text-sm text-muted-foreground">Créez et gérez vos offres promotionnelles</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle promotion
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4 space-y-6">
        {/* Promotion Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promotions actives</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{promotions.filter((p) => p.status === "Actif").length}</div>
              <p className="text-xs text-muted-foreground">En cours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisations ce mois</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{promotions.reduce((sum, p) => sum + p.usageCount, 0)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+23%</span> vs mois dernier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Économies clients</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€3,240</div>
              <p className="text-xs text-muted-foreground">Total économisé</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de conversion</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.8%</div>
              <p className="text-xs text-muted-foreground">Codes utilisés</p>
            </CardContent>
          </Card>
        </div>

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
                    placeholder="Rechercher par nom ou code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Programmé">Programmé</SelectItem>
                  <SelectItem value="Expiré">Expiré</SelectItem>
                  <SelectItem value="Suspendu">Suspendu</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="Pourcentage">Pourcentage</SelectItem>
                  <SelectItem value="Montant fixe">Montant fixe</SelectItem>
                  <SelectItem value="Livraison gratuite">Livraison gratuite</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Promotions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Promotions ({filteredPromotions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Promotion</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead>Utilisation</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPromotions.map((promotion) => (
                  <TableRow key={promotion.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{promotion.name}</p>
                        <p className="text-sm text-muted-foreground">{promotion.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTypeColor(promotion.type)}>{promotion.type}</Badge>
                      {promotion.type !== "Livraison gratuite" && (
                        <p className="text-sm mt-1">
                          {promotion.type === "Pourcentage" ? `${promotion.value}%` : `€${promotion.value}`}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <code className="bg-muted px-2 py-1 rounded text-sm">{promotion.code}</code>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>Du {promotion.startDate}</p>
                        <p>Au {promotion.endDate}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{promotion.usageCount}</p>
                        {promotion.usageLimit && (
                          <p className="text-sm text-muted-foreground">/ {promotion.usageLimit}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(promotion.status)}>{promotion.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedPromotion(promotion)}>
                              Voir
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Détails de la promotion</DialogTitle>
                              <DialogDescription>{selectedPromotion.name}</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <h4 className="font-medium mb-2">Informations générales</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span>Nom:</span>
                                      <span className="font-medium">{selectedPromotion.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Code:</span>
                                      <code className="bg-muted px-1 rounded">{selectedPromotion.code}</code>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Type:</span>
                                      <Badge variant={getTypeColor(selectedPromotion.type)}>
                                        {selectedPromotion.type}
                                      </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Valeur:</span>
                                      <span>
                                        {selectedPromotion.type === "Pourcentage"
                                          ? `${selectedPromotion.value}%`
                                          : selectedPromotion.type === "Montant fixe"
                                            ? `€${selectedPromotion.value}`
                                            : "Gratuit"}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">Conditions</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span>Montant minimum:</span>
                                      <span>€{selectedPromotion.minAmount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Clients éligibles:</span>
                                      <span>{selectedPromotion.customers}</span>
                                    </div>
                                    <div>
                                      <span>Catégories:</span>
                                      <div className="mt-1">
                                        {selectedPromotion.categories.map((cat: string, index: number) => (
                                          <Badge key={index} variant="outline" className="mr-1 text-xs">
                                            {cat}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="border-t pt-4">
                                <h4 className="font-medium mb-2">Période et utilisation</h4>
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span>Date de début:</span>
                                      <span>{selectedPromotion.startDate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Date de fin:</span>
                                      <span>{selectedPromotion.endDate}</span>
                                    </div>
                                  </div>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span>Utilisations:</span>
                                      <span>{selectedPromotion.usageCount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Limite:</span>
                                      <span>{selectedPromotion.usageLimit || "Illimitée"}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button onClick={() => handleEdit(selectedPromotion)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Modifier
                                </Button>
                                <Button variant="outline">Dupliquer</Button>
                                <Button variant="outline">Statistiques</Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(promotion)}>
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

        {/* Add/Edit Promotion Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPromotion ? "Modifier la promotion" : "Nouvelle promotion"}</DialogTitle>
              <DialogDescription>
                {editingPromotion
                  ? "Modifiez les paramètres de la promotion"
                  : "Créez une nouvelle offre promotionnelle"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de la promotion</Label>
                  <Input id="name" placeholder="Ex: Promo Ramadan 2024" defaultValue={editingPromotion?.name || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Code promo</Label>
                  <Input id="code" placeholder="RAMADAN2024" defaultValue={editingPromotion?.code || ""} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Description de la promotion..."
                  defaultValue={editingPromotion?.description || ""}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="type">Type de réduction</Label>
                  <Select defaultValue={editingPromotion?.type || ""} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pourcentage">Pourcentage</SelectItem>
                      <SelectItem value="Montant fixe">Montant fixe</SelectItem>
                      <SelectItem value="Livraison gratuite">Livraison gratuite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Valeur</Label>
                  <Input
                    id="value"
                    type="number"
                    placeholder="15"
                    defaultValue={editingPromotion?.value || ""}
                    disabled={selectedType === "Livraison gratuite"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minAmount">Montant minimum (€)</Label>
                  <Input
                    id="minAmount"
                    type="number"
                    placeholder="50"
                    defaultValue={editingPromotion?.minAmount || ""}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="maxAmount">Montant maximum (€)</Label>
                  <Input
                    id="maxAmount"
                    type="number"
                    placeholder="500 (optionnel)"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usageLimitPerClient">Limite par client</Label>
                  <Input
                    id="usageLimitPerClient"
                    type="number"
                    placeholder="1 (laisser vide pour illimité)"
                    value={usageLimitPerClient}
                    onChange={(e) => setUsageLimitPerClient(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="customers">Clients éligibles</Label>
                  <Select defaultValue={editingPromotion?.customers || "Tous"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner les clients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tous">Tous les clients</SelectItem>
                      <SelectItem value="Nouveaux clients">Nouveaux clients</SelectItem>
                      <SelectItem value="Clients fidèles">Clients fidèles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newClientPeriod">Période "nouveau client" (jours)</Label>
                  <Input
                    id="newClientPeriod"
                    type="number"
                    placeholder="30"
                    value={newClientPeriod}
                    onChange={(e) => setNewClientPeriod(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Catégories concernées</Label>
                <div className="space-y-2">
                  <Input
                    placeholder="Rechercher une catégorie..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                  />
                  <div className="grid gap-2 md:grid-cols-3 max-h-32 overflow-y-auto">
                    {["Toutes", "Céréales", "Huiles", "Hygiène", "Pâtes", "Conserves"]
                      .filter((cat) => cat.toLowerCase().includes(categorySearch.toLowerCase()))
                      .map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={category}
                            defaultChecked={editingPromotion?.categories?.includes(category)}
                          />
                          <Label htmlFor={category} className="text-sm">
                            {category}
                          </Label>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="isActive" defaultChecked={editingPromotion?.status === "Actif" ?? true} />
                <Label htmlFor="isActive">Promotion active</Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setIsDialogOpen(false)}>
                  {editingPromotion ? "Mettre à jour" : "Créer la promotion"}
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
