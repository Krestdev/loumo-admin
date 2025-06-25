"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Truck, MapPin, Clock, User, Phone, Package, Navigation, Plus, Edit, Trash2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const deliveries = [
  {
    id: "DEL-001",
    orderId: "#ORD-001",
    customer: "Marie Dubois",
    address: "Rue 15, Immeuble Salam, Apt 3B",
    zone: "Dakar Plateau",
    driver: {
      name: "Ibrahima Sarr",
      phone: "+221 77 555 01 23",
      avatar: "/placeholder-user.jpg",
      rating: 4.8,
    },
    status: "En cours",
    scheduledTime: "2024-01-16 10:00",
    estimatedArrival: "2024-01-16 10:15",
    weight: 12.5,
    items: 3,
    priority: "Normal",
    trackingCode: "TRK001234",
  },
  {
    id: "DEL-002",
    orderId: "#ORD-002",
    customer: "Amadou Ba",
    address: "Villa 123, Cité Millionnaire",
    zone: "Parcelles Assainies",
    driver: {
      name: "Moussa Diallo",
      phone: "+221 76 444 56 78",
      avatar: "/placeholder-user.jpg",
      rating: 4.6,
    },
    status: "Livré",
    scheduledTime: "2024-01-15 16:30",
    deliveredTime: "2024-01-15 16:45",
    weight: 18.2,
    items: 5,
    priority: "Normal",
    trackingCode: "TRK001235",
  },
  {
    id: "DEL-003",
    orderId: "#ORD-003",
    customer: "Fatou Sall",
    address: "Résidence Les Palmiers, Villa 45",
    zone: "Almadies",
    driver: null,
    status: "En attente",
    scheduledTime: "2024-01-16 14:00",
    weight: 8.7,
    items: 2,
    priority: "Urgent",
    trackingCode: "TRK001236",
  },
  {
    id: "DEL-004",
    orderId: "#ORD-004",
    customer: "Ousmane Diop",
    address: "Quartier Résidentiel, Maison 67",
    zone: "Yoff",
    driver: {
      name: "Abdou Kane",
      phone: "+221 78 333 44 55",
      avatar: "/placeholder-user.jpg",
      rating: 4.9,
    },
    status: "En route",
    scheduledTime: "2024-01-16 11:30",
    estimatedArrival: "2024-01-16 11:45",
    weight: 25.1,
    items: 7,
    priority: "Normal",
    trackingCode: "TRK001237",
  },
]

const drivers = [
  {
    id: 1,
    name: "Ibrahima Sarr",
    phone: "+221 77 555 01 23",
    zone: "Dakar Plateau",
    status: "En livraison",
    currentDeliveries: 2,
    todayDeliveries: 8,
    rating: 4.8,
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 2,
    name: "Moussa Diallo",
    phone: "+221 76 444 56 78",
    zone: "Parcelles Assainies",
    status: "Disponible",
    currentDeliveries: 0,
    todayDeliveries: 12,
    rating: 4.6,
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 3,
    name: "Abdou Kane",
    phone: "+221 78 333 44 55",
    zone: "Yoff",
    status: "En route",
    currentDeliveries: 1,
    todayDeliveries: 6,
    rating: 4.9,
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 4,
    name: "Fatou Mbaye",
    phone: "+221 77 666 77 88",
    zone: "Almadies",
    status: "Pause",
    currentDeliveries: 0,
    todayDeliveries: 9,
    rating: 4.7,
    avatar: "/placeholder-user.jpg",
  },
]

export default function DeliveriesPage() {
  const [selectedDelivery, setSelectedDelivery] = useState(deliveries[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [zoneFilter, setZoneFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("deliveries")

  const [selectedDriver, setSelectedDriver] = useState(null)
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false)
  const [isEditDriverOpen, setIsEditDriverOpen] = useState(false)
  const [newDriver, setNewDriver] = useState({
    name: "",
    phone: "",
    zone: "",
    email: "",
    address: "",
    vehicleType: "Moto",
    licenseNumber: "",
  })

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.trackingCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || delivery.status === statusFilter
    const matchesZone = zoneFilter === "all" || delivery.zone === zoneFilter
    return matchesSearch && matchesStatus && matchesZone
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Livré":
        return "default"
      case "En cours":
        return "secondary"
      case "En route":
        return "outline"
      case "En attente":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "destructive"
      case "Normal":
        return "outline"
      default:
        return "outline"
    }
  }

  const getDriverStatusColor = (status: string) => {
    switch (status) {
      case "Disponible":
        return "default"
      case "En livraison":
        return "secondary"
      case "En route":
        return "outline"
      case "Pause":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Gestion des livraisons</h1>
            <p className="text-sm text-muted-foreground">Suivez et assignez les livraisons</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setActiveTab("deliveries")}>
              Livraisons
            </Button>
            <Button variant="outline" onClick={() => setActiveTab("drivers")}>
              Livreurs
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4 space-y-6">
        {/* Delivery Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En cours</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Livraisons actives</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Livrées aujourd'hui</CardTitle>
              <Package className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8</span> vs hier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temps moyen</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42min</div>
              <p className="text-xs text-muted-foreground">Temps de livraison</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Livreurs actifs</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Sur 12 disponibles</p>
            </CardContent>
          </Card>
        </div>

        {activeTab === "deliveries" ? (
          <>
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
                        placeholder="Rechercher par client, commande ou code..."
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
                      <SelectItem value="En attente">En attente</SelectItem>
                      <SelectItem value="En cours">En cours</SelectItem>
                      <SelectItem value="En route">En route</SelectItem>
                      <SelectItem value="Livré">Livré</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={zoneFilter} onValueChange={setZoneFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les zones</SelectItem>
                      <SelectItem value="Dakar Plateau">Dakar Plateau</SelectItem>
                      <SelectItem value="Parcelles Assainies">Parcelles Assainies</SelectItem>
                      <SelectItem value="Almadies">Almadies</SelectItem>
                      <SelectItem value="Yoff">Yoff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Deliveries Table */}
            <Card>
              <CardHeader>
                <CardTitle>Livraisons ({filteredDeliveries.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Livraison</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Zone</TableHead>
                      <TableHead>Livreur</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Priorité</TableHead>
                      <TableHead>Heure prévue</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDeliveries.map((delivery) => (
                      <TableRow key={delivery.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{delivery.id}</p>
                            <p className="text-sm text-muted-foreground">{delivery.orderId}</p>
                            <p className="text-xs text-muted-foreground">{delivery.trackingCode}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{delivery.customer}</p>
                            <p className="text-sm text-muted-foreground">{delivery.address}</p>
                          </div>
                        </TableCell>
                        <TableCell>{delivery.zone}</TableCell>
                        <TableCell>
                          {delivery.driver ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={delivery.driver.avatar || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {delivery.driver.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{delivery.driver.name}</p>
                                <p className="text-xs text-muted-foreground">{delivery.driver.phone}</p>
                              </div>
                            </div>
                          ) : (
                            <Badge variant="outline">Non assigné</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(delivery.status)}>{delivery.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPriorityColor(delivery.priority)}>{delivery.priority}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{delivery.scheduledTime}</p>
                            {delivery.estimatedArrival && (
                              <p className="text-xs text-muted-foreground">ETA: {delivery.estimatedArrival}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedDelivery(delivery)}>
                                Détails
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Détails de la livraison {selectedDelivery.id}</DialogTitle>
                                <DialogDescription>Informations complètes sur la livraison</DialogDescription>
                              </DialogHeader>

                              <div className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <h4 className="font-medium mb-2 flex items-center gap-2">
                                      <Package className="h-4 w-4" />
                                      Informations commande
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span>Commande:</span>
                                        <span className="font-medium">{selectedDelivery.orderId}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Code suivi:</span>
                                        <span className="font-mono">{selectedDelivery.trackingCode}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Poids:</span>
                                        <span>{selectedDelivery.weight}kg</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Articles:</span>
                                        <span>{selectedDelivery.items} produits</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-medium mb-2 flex items-center gap-2">
                                      <MapPin className="h-4 w-4" />
                                      Adresse de livraison
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                      <div>
                                        <p className="font-medium">{selectedDelivery.customer}</p>
                                        <p>{selectedDelivery.address}</p>
                                        <p className="text-muted-foreground">{selectedDelivery.zone}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {selectedDelivery.driver && (
                                  <div className="border-t pt-4">
                                    <h4 className="font-medium mb-2 flex items-center gap-2">
                                      <User className="h-4 w-4" />
                                      Livreur assigné
                                    </h4>
                                    <div className="flex items-center gap-3">
                                      <Avatar className="h-10 w-10">
                                        <AvatarImage src={selectedDelivery.driver.avatar || "/placeholder.svg"} />
                                        <AvatarFallback>
                                          {selectedDelivery.driver.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="font-medium">{selectedDelivery.driver.name}</p>
                                        <p className="text-sm text-muted-foreground">{selectedDelivery.driver.phone}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                          <span className="text-xs">Note: {selectedDelivery.driver.rating}/5</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                <div className="border-t pt-4">
                                  <h4 className="font-medium mb-2 flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Horaires
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span>Heure prévue:</span>
                                      <span>{selectedDelivery.scheduledTime}</span>
                                    </div>
                                    {selectedDelivery.estimatedArrival && (
                                      <div className="flex justify-between">
                                        <span>Arrivée estimée:</span>
                                        <span>{selectedDelivery.estimatedArrival}</span>
                                      </div>
                                    )}
                                    {selectedDelivery.deliveredTime && (
                                      <div className="flex justify-between">
                                        <span>Livré à:</span>
                                        <span className="text-green-600">{selectedDelivery.deliveredTime}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <Button>
                                    <Navigation className="mr-2 h-4 w-4" />
                                    Suivre en temps réel
                                  </Button>
                                  <Button variant="outline">
                                    <Phone className="mr-2 h-4 w-4" />
                                    Contacter livreur
                                  </Button>
                                  {!selectedDelivery.driver && <Button variant="outline">Assigner livreur</Button>}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Drivers Tab */
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Équipe de livraison</CardTitle>
              <Button onClick={() => setIsAddDriverOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un livreur
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {drivers.map((driver) => (
                  <Card key={driver.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={driver.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {driver.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{driver.name}</p>
                          <p className="text-sm text-muted-foreground">{driver.phone}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedDriver(driver)
                              setIsEditDriverOpen(true)
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Zone:</span>
                          <span>{driver.zone}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Statut:</span>
                          <Badge variant={getDriverStatusColor(driver.status)}>{driver.status}</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>En cours:</span>
                          <span>{driver.currentDeliveries} livraisons</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Aujourd'hui:</span>
                          <span>{driver.todayDeliveries} livrées</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Note:</span>
                          <span>{driver.rating}/5 ⭐</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Phone className="mr-1 h-3 w-3" />
                          Appeler
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Assigner
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dialog Ajouter Livreur */}
        <Dialog open={isAddDriverOpen} onOpenChange={setIsAddDriverOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau livreur</DialogTitle>
              <DialogDescription>Remplissez les informations du nouveau livreur</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  value={newDriver.name}
                  onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                  placeholder="Ex: Ibrahima Sarr"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={newDriver.phone}
                  onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                  placeholder="Ex: +221 77 123 45 67"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newDriver.email}
                  onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                  placeholder="Ex: ibrahima@oumoul.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="zone">Zone de couverture</Label>
                <Select value={newDriver.zone} onValueChange={(value) => setNewDriver({ ...newDriver, zone: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dakar Plateau">Dakar Plateau</SelectItem>
                    <SelectItem value="Parcelles Assainies">Parcelles Assainies</SelectItem>
                    <SelectItem value="Almadies">Almadies</SelectItem>
                    <SelectItem value="Yoff">Yoff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vehicle">Type de véhicule</Label>
                <Select
                  value={newDriver.vehicleType}
                  onValueChange={(value) => setNewDriver({ ...newDriver, vehicleType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Moto">Moto</SelectItem>
                    <SelectItem value="Voiture">Voiture</SelectItem>
                    <SelectItem value="Camionnette">Camionnette</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="license">Numéro de permis</Label>
                <Input
                  id="license"
                  value={newDriver.licenseNumber}
                  onChange={(e) => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
                  placeholder="Ex: A123456789"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Adresse</Label>
                <Textarea
                  id="address"
                  value={newDriver.address}
                  onChange={(e) => setNewDriver({ ...newDriver, address: e.target.value })}
                  placeholder="Adresse complète du livreur"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsAddDriverOpen(false)} className="flex-1">
                Annuler
              </Button>
              <Button onClick={() => setIsAddDriverOpen(false)} className="flex-1">
                Ajouter le livreur
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog Modifier Livreur */}
        <Dialog open={isEditDriverOpen} onOpenChange={setIsEditDriverOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Modifier le livreur</DialogTitle>
              <DialogDescription>Modifiez les informations du livreur</DialogDescription>
            </DialogHeader>
            {selectedDriver && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Nom complet</Label>
                  <Input id="edit-name" defaultValue={selectedDriver.name} placeholder="Ex: Ibrahima Sarr" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-phone">Téléphone</Label>
                  <Input id="edit-phone" defaultValue={selectedDriver.phone} placeholder="Ex: +221 77 123 45 67" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-zone">Zone de couverture</Label>
                  <Select defaultValue={selectedDriver.zone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dakar Plateau">Dakar Plateau</SelectItem>
                      <SelectItem value="Parcelles Assainies">Parcelles Assainies</SelectItem>
                      <SelectItem value="Almadies">Almadies</SelectItem>
                      <SelectItem value="Yoff">Yoff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Statut</Label>
                  <Select defaultValue={selectedDriver.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Disponible">Disponible</SelectItem>
                      <SelectItem value="En livraison">En livraison</SelectItem>
                      <SelectItem value="En route">En route</SelectItem>
                      <SelectItem value="Pause">Pause</SelectItem>
                      <SelectItem value="Indisponible">Indisponible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <div className="flex gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsEditDriverOpen(false)} className="flex-1">
                Annuler
              </Button>
              <Button onClick={() => setIsEditDriverOpen(false)} className="flex-1">
                Sauvegarder
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
