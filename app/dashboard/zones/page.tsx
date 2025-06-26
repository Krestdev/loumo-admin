"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { MapPin, Plus, Edit, Trash2, Store, Truck, DollarSign } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const zones = [
  {
    id: 1,
    name: "Dakar Plateau",
    description: "Centre-ville de Dakar",
    deliveryFee: 2.5,
    maxWeight: 30,
    estimatedTime: "30-45 min",
    stores: ["Boutique Plateau"],
    neighborhoods: ["Plateau", "Médina", "Gueule Tapée"],
    status: "Actif",
    orders: 156,
  },
  {
    id: 2,
    name: "Parcelles Assainies",
    description: "Zone résidentielle populaire",
    deliveryFee: 3.0,
    maxWeight: 35,
    estimatedTime: "45-60 min",
    stores: ["Boutique Parcelles"],
    neighborhoods: ["Unité 1", "Unité 2", "Unité 3", "Unité 4"],
    status: "Actif",
    orders: 203,
  },
  {
    id: 3,
    name: "Almadies",
    description: "Zone résidentielle haut standing",
    deliveryFee: 4.0,
    maxWeight: 25,
    estimatedTime: "60-75 min",
    stores: ["Boutique Almadies"],
    neighborhoods: ["Almadies", "Ngor", "Ouakam"],
    status: "Actif",
    orders: 89,
  },
  {
    id: 4,
    name: "Yoff",
    description: "Zone côtière",
    deliveryFee: 3.5,
    maxWeight: 30,
    estimatedTime: "45-60 min",
    stores: ["Boutique Almadies"],
    neighborhoods: ["Yoff", "Cambérène"],
    status: "Actif",
    orders: 67,
  },
  {
    id: 5,
    name: "Guédiawaye",
    description: "Banlieue de Dakar",
    deliveryFee: 4.5,
    maxWeight: 40,
    estimatedTime: "60-90 min",
    stores: ["Boutique Parcelles"],
    neighborhoods: ["Guédiawaye", "Sam Notaire"],
    status: "En préparation",
    orders: 0,
  },
]

export default function ZonesPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actif":
        return "default"
      case "En préparation":
        return "secondary"
      case "Inactif":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <main className="flex-1 overflow-auto p-4 space-y-6">
        {/* Zone Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Zones actives</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">+1 en préparation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quartiers couverts</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">13</div>
              <p className="text-xs text-muted-foreground">Quartiers desservis</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Livraisons ce mois</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">515</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+18%</span> vs mois dernier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Frais moyens</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€3.25</div>
              <p className="text-xs text-muted-foreground">Frais de livraison moyen</p>
            </CardContent>
          </Card>
        </div>

        {/* Zones Table */}
        <Card>
          <CardHeader>
            <CardTitle>Zones de livraison</CardTitle>
            <CardDescription>Configuration des zones et tarifs de livraison</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Zone</TableHead>
                  <TableHead>Quartiers</TableHead>
                  <TableHead>Boutique(s)</TableHead>
                  <TableHead>Frais de livraison</TableHead>
                  <TableHead>Poids max</TableHead>
                  <TableHead>Temps estimé</TableHead>
                  <TableHead>Commandes</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {zones.map((zone) => (
                  <TableRow key={zone.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{zone.name}</p>
                        <p className="text-sm text-muted-foreground">{zone.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {zone.neighborhoods.map((neighborhood, index) => (
                          <Badge key={index} variant="outline" className="mr-1 mb-1">
                            {neighborhood}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {zone.stores.map((store, index) => (
                          <div key={index} className="flex items-center gap-1">
                            <Store className="h-3 w-3" />
                            <span className="text-sm">{store.replace("Boutique ", "")}</span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">€{zone.deliveryFee.toFixed(2)}</div>
                    </TableCell>
                    <TableCell>{zone.maxWeight}kg</TableCell>
                    <TableCell>{zone.estimatedTime}</TableCell>
                    <TableCell>
                      <div className="font-medium">{zone.orders}</div>
                      <div className="text-xs text-muted-foreground">ce mois</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(zone.status)}>{zone.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
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

        {/* Zone Coverage Map Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Couverture géographique</CardTitle>
            <CardDescription>Visualisation des zones de livraison sur la carte</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Carte des zones de livraison</p>
                <p className="text-sm text-muted-foreground">Intégration carte à venir</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
