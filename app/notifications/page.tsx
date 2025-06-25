"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Bell, AlertTriangle, Info, CheckCircle, Plus, Send, Settings, Edit } from "lucide-react"

const notifications = [
  {
    id: 1,
    title: "Stock faible - Riz Brisé Premium",
    message: "Le stock de Riz Brisé Premium 25kg est en dessous du seuil minimum (5 unités restantes)",
    type: "Alerte stock",
    priority: "Urgent",
    recipients: ["Gestionnaire Plateau", "Administrateur"],
    status: "Envoyé",
    createdAt: "2024-01-15 14:30",
    sentAt: "2024-01-15 14:31",
    readBy: ["admin@oumoul.com"],
    isRead: false,
  },
  {
    id: 2,
    title: "Nouvelle commande #ORD-001",
    message: "Une nouvelle commande de 45.80€ a été passée par Marie Dubois",
    type: "Nouvelle commande",
    priority: "Normal",
    recipients: ["Tous les gestionnaires"],
    status: "Envoyé",
    createdAt: "2024-01-15 14:25",
    sentAt: "2024-01-15 14:25",
    readBy: ["admin@oumoul.com", "gestionnaire@oumoul.com"],
    isRead: true,
  },
  {
    id: 3,
    title: "Paiement échoué - Commande #ORD-004",
    message: "Le paiement de 91.30€ pour la commande #ORD-004 a échoué (Fonds insuffisants)",
    type: "Problème paiement",
    priority: "Urgent",
    recipients: ["Comptable", "Administrateur"],
    status: "Envoyé",
    createdAt: "2024-01-14 11:22",
    sentAt: "2024-01-14 11:23",
    readBy: [],
    isRead: false,
  },
  {
    id: 4,
    title: "Nouveau client VIP",
    message: "Ousmane Diop vient d'atteindre le statut VIP avec 3200 points de fidélité",
    type: "Fidélité",
    priority: "Info",
    recipients: ["Équipe commerciale"],
    status: "Programmé",
    createdAt: "2024-01-14 10:00",
    sentAt: null,
    readBy: [],
    isRead: false,
  },
  {
    id: 5,
    title: "Livraison en retard - Zone Almadies",
    message: "3 livraisons sont en retard dans la zone Almadies. Temps moyen de retard: 45 minutes",
    type: "Problème livraison",
    priority: "Attention",
    recipients: ["Responsable livraisons"],
    status: "Envoyé",
    createdAt: "2024-01-13 16:45",
    sentAt: "2024-01-13 16:46",
    readBy: ["livraison@oumoul.com"],
    isRead: true,
  },
]

const notificationRules = [
  {
    id: 1,
    name: "Stock faible",
    description: "Alerte quand le stock d'un produit passe sous le seuil minimum",
    trigger: "Stock < seuil minimum",
    recipients: ["Gestionnaires", "Administrateurs"],
    channels: ["Email", "Dashboard"],
    isActive: true,
    priority: "Urgent",
  },
  {
    id: 2,
    name: "Nouvelle commande",
    description: "Notification pour chaque nouvelle commande",
    trigger: "Nouvelle commande créée",
    recipients: ["Gestionnaires"],
    channels: ["Dashboard"],
    isActive: true,
    priority: "Normal",
  },
  {
    id: 3,
    name: "Paiement échoué",
    description: "Alerte en cas d'échec de paiement",
    trigger: "Paiement échoué",
    recipients: ["Comptables", "Administrateurs"],
    channels: ["Email", "SMS", "Dashboard"],
    isActive: true,
    priority: "Urgent",
  },
  {
    id: 4,
    name: "Livraison en retard",
    description: "Alerte quand une livraison dépasse le délai prévu de plus de 30 minutes",
    trigger: "Retard livraison > 30 min",
    recipients: ["Responsables livraisons"],
    channels: ["Email", "Dashboard"],
    isActive: true,
    priority: "Attention",
  },
  {
    id: 5,
    name: "Nouveau client VIP",
    description: "Notification quand un client atteint le statut VIP",
    trigger: "Client atteint statut VIP",
    recipients: ["Équipe commerciale"],
    channels: ["Dashboard"],
    isActive: false,
    priority: "Info",
  },
]

export default function NotificationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<any>(null)

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || notification.type === typeFilter
    const matchesPriority = priorityFilter === "all" || notification.priority === priorityFilter
    const matchesStatus = statusFilter === "all" || notification.status === statusFilter
    return matchesSearch && matchesType && matchesPriority && matchesStatus
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Alerte stock":
        return "destructive"
      case "Nouvelle commande":
        return "default"
      case "Problème paiement":
        return "destructive"
      case "Problème livraison":
        return "secondary"
      case "Fidélité":
        return "outline"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "destructive"
      case "Attention":
        return "secondary"
      case "Normal":
        return "default"
      case "Info":
        return "outline"
      default:
        return "outline"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return AlertTriangle
      case "Attention":
        return AlertTriangle
      case "Normal":
        return Bell
      case "Info":
        return Info
      default:
        return Bell
    }
  }

  const handleEditRule = (rule: any) => {
    setEditingRule(rule)
    setIsRuleDialogOpen(true)
  }

  const handleAddRule = () => {
    setEditingRule(null)
    setIsRuleDialogOpen(true)
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Gestion des notifications</h1>
            <p className="text-sm text-muted-foreground">Configurez et suivez les alertes système</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Send className="mr-2 h-4 w-4" />
              Envoyer notification
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4 space-y-6">
        {/* Notification Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Non lues</CardTitle>
              <Bell className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notifications.filter((n) => !n.isRead).length}</div>
              <p className="text-xs text-muted-foreground">Notifications en attente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notifications.filter((n) => n.priority === "Urgent").length}</div>
              <p className="text-xs text-muted-foreground">Nécessitent attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Envoyées aujourd'hui</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notifications.filter((n) => n.status === "Envoyé").length}</div>
              <p className="text-xs text-muted-foreground">Notifications distribuées</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Règles actives</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notificationRules.filter((r) => r.isActive).length}</div>
              <p className="text-xs text-muted-foreground">Sur {notificationRules.length} règles</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="rules">Règles</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
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
                        placeholder="Rechercher une notification..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="Alerte stock">Alerte stock</SelectItem>
                      <SelectItem value="Nouvelle commande">Nouvelle commande</SelectItem>
                      <SelectItem value="Problème paiement">Problème paiement</SelectItem>
                      <SelectItem value="Problème livraison">Problème livraison</SelectItem>
                      <SelectItem value="Fidélité">Fidélité</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                      <SelectItem value="Attention">Attention</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Info">Info</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="Envoyé">Envoyé</SelectItem>
                      <SelectItem value="Programmé">Programmé</SelectItem>
                      <SelectItem value="Brouillon">Brouillon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Notifications Table */}
            <Card>
              <CardHeader>
                <CardTitle>Notifications ({filteredNotifications.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Notification</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Priorité</TableHead>
                      <TableHead>Destinataires</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNotifications.map((notification) => {
                      const PriorityIcon = getPriorityIcon(notification.priority)
                      return (
                        <TableRow key={notification.id} className={!notification.isRead ? "bg-muted/30" : ""}>
                          <TableCell>
                            <div className="flex items-start gap-3">
                              <PriorityIcon className="h-4 w-4 mt-1 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{notification.title}</p>
                                <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getTypeColor(notification.type)}>{notification.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getPriorityColor(notification.priority)}>{notification.priority}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {notification.recipients.map((recipient, index) => (
                                <Badge key={index} variant="outline" className="text-xs mr-1">
                                  {recipient}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={notification.status === "Envoyé" ? "default" : "secondary"}>
                              {notification.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p>Créé: {notification.createdAt}</p>
                              {notification.sentAt && (
                                <p className="text-muted-foreground">Envoyé: {notification.sentAt}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Détails
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>{notification.title}</DialogTitle>
                                  <DialogDescription>Détails de la notification</DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4">
                                  <div>
                                    <Label>Message</Label>
                                    <p className="text-sm mt-1">{notification.message}</p>
                                  </div>

                                  <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                      <Label>Type</Label>
                                      <div className="mt-1">
                                        <Badge variant={getTypeColor(notification.type)}>{notification.type}</Badge>
                                      </div>
                                    </div>
                                    <div>
                                      <Label>Priorité</Label>
                                      <div className="mt-1">
                                        <Badge variant={getPriorityColor(notification.priority)}>
                                          {notification.priority}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <Label>Destinataires</Label>
                                    <div className="mt-1 space-y-1">
                                      {notification.recipients.map((recipient, index) => (
                                        <Badge key={index} variant="outline" className="mr-1">
                                          {recipient}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                      <Label>Date de création</Label>
                                      <p className="text-sm mt-1">{notification.createdAt}</p>
                                    </div>
                                    <div>
                                      <Label>Date d'envoi</Label>
                                      <p className="text-sm mt-1">{notification.sentAt || "Non envoyé"}</p>
                                    </div>
                                  </div>

                                  {notification.readBy.length > 0 && (
                                    <div>
                                      <Label>Lu par</Label>
                                      <div className="mt-1 space-y-1">
                                        {notification.readBy.map((reader, index) => (
                                          <Badge key={index} variant="outline" className="mr-1 text-xs">
                                            {reader}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="space-y-6">
            {/* Add Rule Button */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Règles de notification
                  <Button onClick={handleAddRule}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle règle
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Règle</TableHead>
                      <TableHead>Déclencheur</TableHead>
                      <TableHead>Destinataires</TableHead>
                      <TableHead>Canaux</TableHead>
                      <TableHead>Priorité</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notificationRules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{rule.name}</p>
                            <p className="text-sm text-muted-foreground">{rule.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="bg-muted px-2 py-1 rounded text-sm">{rule.trigger}</code>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {rule.recipients.map((recipient, index) => (
                              <Badge key={index} variant="outline" className="text-xs mr-1">
                                {recipient}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {rule.channels.map((channel, index) => (
                              <Badge key={index} variant="outline" className="text-xs mr-1">
                                {channel}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPriorityColor(rule.priority)}>{rule.priority}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={rule.isActive ? "default" : "secondary"}>
                            {rule.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => handleEditRule(rule)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add/Edit Rule Dialog */}
        <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingRule ? "Modifier la règle" : "Nouvelle règle"}</DialogTitle>
              <DialogDescription>
                {editingRule ? "Modifiez les paramètres de la règle" : "Créez une nouvelle règle de notification"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ruleName">Nom de la règle</Label>
                  <Input id="ruleName" placeholder="Ex: Stock faible" defaultValue={editingRule?.name || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priorité</Label>
                  <Select defaultValue={editingRule?.priority || "Normal"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                      <SelectItem value="Attention">Attention</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Info">Info</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Description de la règle..."
                  defaultValue={editingRule?.description || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trigger">Déclencheur</Label>
                <Input id="trigger" placeholder="Ex: Stock < seuil minimum" defaultValue={editingRule?.trigger || ""} />
              </div>

              <div className="space-y-4">
                <Label>Destinataires</Label>
                <div className="grid gap-2 md:grid-cols-2">
                  {[
                    "Administrateurs",
                    "Gestionnaires",
                    "Comptables",
                    "Responsables livraisons",
                    "Équipe commerciale",
                  ].map((recipient) => (
                    <div key={recipient} className="flex items-center space-x-2">
                      <Checkbox id={recipient} defaultChecked={editingRule?.recipients?.includes(recipient)} />
                      <Label htmlFor={recipient} className="text-sm">
                        {recipient}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Canaux de notification</Label>
                <div className="grid gap-2 md:grid-cols-3">
                  {["Email", "SMS", "Dashboard", "Push"].map((channel) => (
                    <div key={channel} className="flex items-center space-x-2">
                      <Checkbox id={channel} defaultChecked={editingRule?.channels?.includes(channel)} />
                      <Label htmlFor={channel} className="text-sm">
                        {channel}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="ruleActive" defaultChecked={editingRule?.isActive ?? true} />
                <Label htmlFor="ruleActive">Règle active</Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setIsRuleDialogOpen(false)}>
                  {editingRule ? "Mettre à jour" : "Créer la règle"}
                </Button>
                <Button variant="outline" onClick={() => setIsRuleDialogOpen(false)}>
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
