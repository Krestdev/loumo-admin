"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Store,
  MapPin,
  Phone,
  Clock,
  Users,
  Package,
  TrendingUp,
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  Eye,
  Settings,
} from "lucide-react"

export default function StoresPage() {
  const [selectedStore, setSelectedStore] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const stores = [
    {
      id: 1,
      name: "Oumoul Centre-Ville",
      address: "123 Avenue Mohammed V, Casablanca",
      phone: "+212 522 123 456",
      manager: "Ahmed Benali",
      status: "active",
      type: "flagship",
      openingHours: "08:00 - 22:00",
      employees: 15,
      monthlyRevenue: 450000,
      totalOrders: 1250,
      coverage: ["Maarif", "Centre-Ville", "Gauthier"],
      coordinates: { lat: 33.5731, lng: -7.5898 },
    },
    {
      id: 2,
      name: "Oumoul Ain Sebaa",
      address: "456 Boulevard Zerktouni, Ain Sebaa",
      phone: "+212 522 789 012",
      manager: "Fatima Alaoui",
      status: "active",
      type: "standard",
      openingHours: "09:00 - 21:00",
      employees: 8,
      monthlyRevenue: 280000,
      totalOrders: 890,
      coverage: ["Ain Sebaa", "Hay Mohammadi"],
      coordinates: { lat: 33.6061, lng: -7.5311 },
    },
    {
      id: 3,
      name: "Oumoul Hay Riad",
      address: "789 Avenue Al Massira, Hay Riad",
      phone: "+212 522 345 678",
      manager: "Omar Tazi",
      status: "maintenance",
      type: "standard",
      openingHours: "08:30 - 21:30",
      employees: 12,
      monthlyRevenue: 320000,
      totalOrders: 1050,
      coverage: ["Hay Riad", "Agdal", "Souissi"],
      coordinates: { lat: 33.9716, lng: -6.8498 },
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "closed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "flagship":
        return "bg-purple-100 text-purple-800"
      case "standard":
        return "bg-blue-100 text-blue-800"
      case "mini":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Gestion des Boutiques</h2>
        <div className="flex items-center space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Boutique
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer une nouvelle boutique</DialogTitle>
                <DialogDescription>Ajoutez une nouvelle boutique au réseau Oumoul</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom de la boutique</Label>
                    <Input id="name" placeholder="Oumoul..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type de boutique</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flagship">Flagship</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="mini">Mini</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse complète</Label>
                  <Textarea id="address" placeholder="Adresse de la boutique..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" placeholder="+212 5XX XXX XXX" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manager">Responsable</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un responsable" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ahmed">Ahmed Benali</SelectItem>
                        <SelectItem value="fatima">Fatima Alaoui</SelectItem>
                        <SelectItem value="omar">Omar Tazi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="opening">Horaires d'ouverture</Label>
                    <Input id="opening" placeholder="08:00 - 22:00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employees">Nombre d'employés</Label>
                    <Input id="employees" type="number" placeholder="10" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Créer la boutique</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="coverage">Zones de couverture</TabsTrigger>
          <TabsTrigger value="inventory">Stock par boutique</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Boutiques</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">+1 ce mois</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Boutiques Actives</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">66.7% du réseau</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Employés</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">35</div>
                <p className="text-xs text-muted-foreground">Moyenne: 11.7 par boutique</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,05M MAD</div>
                <p className="text-xs text-muted-foreground">+12% vs mois dernier</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Liste des Boutiques</CardTitle>
              <CardDescription>Gérez vos boutiques et leurs informations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Boutique</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Employés</TableHead>
                    <TableHead>CA Mensuel</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stores.map((store) => (
                    <TableRow key={store.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{store.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <MapPin className="mr-1 h-3 w-3" />
                            {store.address}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{store.manager}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Phone className="mr-1 h-3 w-3" />
                            {store.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(store.type)}>{store.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(store.status)}>
                          {store.status === "active"
                            ? "Actif"
                            : store.status === "maintenance"
                              ? "Maintenance"
                              : "Fermé"}
                        </Badge>
                      </TableCell>
                      <TableCell>{store.employees}</TableCell>
                      <TableCell>{store.monthlyRevenue.toLocaleString()} MAD</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="mr-2 h-4 w-4" />
                              Paramètres
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {stores.map((store) => (
              <Card key={store.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{store.name}</CardTitle>
                  <CardDescription>Performance mensuelle</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Chiffre d'affaires</span>
                    <span className="font-bold">{store.monthlyRevenue.toLocaleString()} MAD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Commandes</span>
                    <span className="font-bold">{store.totalOrders}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Panier moyen</span>
                    <span className="font-bold">{Math.round(store.monthlyRevenue / store.totalOrders)} MAD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Employés</span>
                    <span className="font-bold">{store.employees}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">CA par employé</span>
                    <span className="font-bold">
                      {Math.round(store.monthlyRevenue / store.employees).toLocaleString()} MAD
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="coverage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Zones de Couverture</CardTitle>
              <CardDescription>Zones desservies par chaque boutique</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {stores.map((store) => (
                  <div key={store.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{store.name}</h3>
                      <Badge className={getStatusColor(store.status)}>
                        {store.status === "active" ? "Actif" : store.status === "maintenance" ? "Maintenance" : "Fermé"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Adresse:</span>
                        <p>{store.address}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Horaires:</span>
                        <p className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {store.openingHours}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="text-muted-foreground text-sm">Zones desservies:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {store.coverage.map((zone) => (
                          <Badge key={zone} variant="outline">
                            {zone}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock par Boutique</CardTitle>
              <CardDescription>Niveaux de stock dans chaque boutique</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input placeholder="Rechercher un produit..." className="max-w-sm" />
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Toutes les boutiques" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les boutiques</SelectItem>
                      {stores.map((store) => (
                        <SelectItem key={store.id} value={store.id.toString()}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produit</TableHead>
                      <TableHead>Centre-Ville</TableHead>
                      <TableHead>Ain Sebaa</TableHead>
                      <TableHead>Hay Riad</TableHead>
                      <TableHead>Stock Total</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Riz Basmati 5kg</div>
                        <div className="text-sm text-muted-foreground">SKU: RIZ-BAS-5KG</div>
                      </TableCell>
                      <TableCell>45</TableCell>
                      <TableCell>23</TableCell>
                      <TableCell>67</TableCell>
                      <TableCell className="font-medium">135</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">En stock</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Huile d'olive 1L</div>
                        <div className="text-sm text-muted-foreground">SKU: HUILE-OLI-1L</div>
                      </TableCell>
                      <TableCell>12</TableCell>
                      <TableCell>8</TableCell>
                      <TableCell>15</TableCell>
                      <TableCell className="font-medium">35</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-100 text-yellow-800">Stock faible</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Pâtes Spaghetti 500g</div>
                        <div className="text-sm text-muted-foreground">SKU: PAT-SPA-500G</div>
                      </TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>5</TableCell>
                      <TableCell>12</TableCell>
                      <TableCell className="font-medium">17</TableCell>
                      <TableCell>
                        <Badge className="bg-red-100 text-red-800">Rupture partielle</Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
