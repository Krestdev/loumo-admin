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
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Plus, Edit, Trash2, Users, Shield, UserCheck, UserX, Mail, Phone } from "lucide-react"

const staff = [
  {
    id: 1,
    name: "Aminata Diallo",
    email: "aminata.diallo@oumoul.com",
    phone: "+221 77 123 45 67",
    role: "Administrateur",
    permissions: ["all"],
    status: "Actif",
    lastLogin: "2024-01-15 14:30",
    createdAt: "2023-01-15",
    avatar: "/placeholder-user.jpg",
    store: "Toutes les boutiques",
  },
  {
    id: 2,
    name: "Moussa Kane",
    email: "moussa.kane@oumoul.com",
    phone: "+221 76 987 65 43",
    role: "Gestionnaire",
    permissions: ["orders", "products", "inventory", "clients"],
    status: "Actif",
    lastLogin: "2024-01-15 09:15",
    createdAt: "2023-03-22",
    avatar: "/placeholder-user.jpg",
    store: "Boutique Plateau",
  },
  {
    id: 3,
    name: "Fatou Mbaye",
    email: "fatou.mbaye@oumoul.com",
    phone: "+221 78 456 78 90",
    role: "Vendeur",
    permissions: ["orders", "clients"],
    status: "Actif",
    lastLogin: "2024-01-14 16:45",
    createdAt: "2023-06-10",
    avatar: "/placeholder-user.jpg",
    store: "Boutique Parcelles",
  },
  {
    id: 4,
    name: "Ibrahima Sow",
    email: "ibrahima.sow@oumoul.com",
    phone: "+221 77 654 32 10",
    role: "Livreur",
    permissions: ["deliveries"],
    status: "Inactif",
    lastLogin: "2024-01-10 11:20",
    createdAt: "2023-08-05",
    avatar: "/placeholder-user.jpg",
    store: "Zone Almadies",
  },
  {
    id: 5,
    name: "Aissatou Ba",
    email: "aissatou.ba@oumoul.com",
    phone: "+221 76 111 22 33",
    role: "Comptable",
    permissions: ["payments", "reports"],
    status: "Actif",
    lastLogin: "2024-01-15 08:30",
    createdAt: "2023-04-18",
    avatar: "/placeholder-user.jpg",
    store: "Siège social",
  },
]

const roles = [
  {
    name: "Administrateur",
    description: "Accès complet à toutes les fonctionnalités",
    permissions: ["all"],
    color: "destructive",
  },
  {
    name: "Gestionnaire",
    description: "Gestion des commandes, produits et stock",
    permissions: ["orders", "products", "inventory", "clients"],
    color: "default",
  },
  {
    name: "Vendeur",
    description: "Gestion des commandes et clients",
    permissions: ["orders", "clients"],
    color: "secondary",
  },
  {
    name: "Livreur",
    description: "Accès aux livraisons uniquement",
    permissions: ["deliveries"],
    color: "outline",
  },
  {
    name: "Comptable",
    description: "Gestion des paiements et rapports",
    permissions: ["payments", "reports"],
    color: "outline",
  },
]

const allPermissions = [
  { id: "orders", name: "Commandes", description: "Gérer les commandes" },
  { id: "products", name: "Produits", description: "Gérer le catalogue" },
  { id: "inventory", name: "Inventaire", description: "Gérer les stocks" },
  { id: "clients", name: "Clients", description: "Gérer les clients" },
  { id: "deliveries", name: "Livraisons", description: "Gérer les livraisons" },
  { id: "payments", name: "Paiements", description: "Gérer les paiements" },
  { id: "reports", name: "Rapports", description: "Accès aux rapports" },
  { id: "staff", name: "Personnel", description: "Gérer le personnel" },
  { id: "settings", name: "Paramètres", description: "Paramètres système" },
]

export default function StaffPage() {
  const [selectedStaff, setSelectedStaff] = useState(staff[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<any>(null)

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || member.role === roleFilter
    const matchesStatus = statusFilter === "all" || member.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actif":
        return "default"
      case "Inactif":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getRoleColor = (role: string) => {
    const roleConfig = roles.find((r) => r.name === role)
    return roleConfig?.color || "outline"
  }

  const handleEdit = (member: any) => {
    setEditingStaff(member)
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingStaff(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="flex h-screen flex-col">
      <main className="flex-1 overflow-auto p-4 space-y-6">
        {/* Staff Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staff.length}</div>
              <p className="text-xs text-muted-foreground">{staff.filter((s) => s.status === "Actif").length} actifs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administrateurs</CardTitle>
              <Shield className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staff.filter((s) => s.role === "Administrateur").length}</div>
              <p className="text-xs text-muted-foreground">Accès complet</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connectés aujourd'hui</CardTitle>
              <UserCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Dernières 24h</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comptes inactifs</CardTitle>
              <UserX className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staff.filter((s) => s.status === "Inactif").length}</div>
              <p className="text-xs text-muted-foreground">À vérifier</p>
            </CardContent>
          </Card>
        </div>

        {/* Roles Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Rôles et permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {roles.map((role, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={role.color as any}>{role.name}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {staff.filter((s) => s.role === role.name).length} membres
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                    <div className="space-y-1">
                      {role.permissions.includes("all") ? (
                        <Badge variant="outline" className="text-xs">
                          Toutes les permissions
                        </Badge>
                      ) : (
                        role.permissions.map((perm) => (
                          <Badge key={perm} variant="outline" className="text-xs mr-1">
                            {allPermissions.find((p) => p.id === perm)?.name}
                          </Badge>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                    placeholder="Rechercher par nom ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.name} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Inactif">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Staff Table */}
        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs ({filteredStaff.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Membre</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Boutique/Zone</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière connexion</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleColor(member.role) as any}>{member.role}</Badge>
                    </TableCell>
                    <TableCell>{member.store}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(member.status)}>{member.status}</Badge>
                    </TableCell>
                    <TableCell>{member.lastLogin}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedStaff(member)}>
                              Voir
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Profil de {selectedStaff.name}</DialogTitle>
                              <DialogDescription>Informations détaillées du membre</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                  <AvatarImage src={selectedStaff.avatar || "/placeholder.svg"} />
                                  <AvatarFallback className="text-lg">
                                    {selectedStaff.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="text-lg font-medium">{selectedStaff.name}</h3>
                                  <Badge variant={getRoleColor(selectedStaff.role) as any}>{selectedStaff.role}</Badge>
                                </div>
                              </div>

                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <h4 className="font-medium mb-2 flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    Contact
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span>Email:</span>
                                      <span>{selectedStaff.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Téléphone:</span>
                                      <span>{selectedStaff.phone}</span>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">Informations</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span>Statut:</span>
                                      <Badge variant={getStatusColor(selectedStaff.status)}>
                                        {selectedStaff.status}
                                      </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Boutique:</span>
                                      <span>{selectedStaff.store}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Créé le:</span>
                                      <span>{selectedStaff.createdAt}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2">Permissions</h4>
                                <div className="grid gap-2 md:grid-cols-2">
                                  {selectedStaff.permissions.includes("all") ? (
                                    <Badge variant="destructive">Toutes les permissions</Badge>
                                  ) : (
                                    selectedStaff.permissions.map((perm: string) => (
                                      <Badge key={perm} variant="outline">
                                        {allPermissions.find((p) => p.id === perm)?.name}
                                      </Badge>
                                    ))
                                  )}
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button onClick={() => handleEdit(selectedStaff)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Modifier
                                </Button>
                                <Button variant="outline">
                                  <Phone className="mr-2 h-4 w-4" />
                                  Contacter
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(member)}>
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

        {/* Add/Edit Staff Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingStaff ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</DialogTitle>
              <DialogDescription>
                {editingStaff
                  ? "Modifiez les informations de l'utilisateur"
                  : "Ajoutez un nouvel utilisateur à votre équipe"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input id="name" placeholder="Ex: Aminata Diallo" defaultValue={editingStaff?.name || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="aminata@oumoul.com"
                    defaultValue={editingStaff?.email || ""}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" placeholder="+221 77 123 45 67" defaultValue={editingStaff?.phone || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Select defaultValue={editingStaff?.role || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.name} value={role.name}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="store">Boutique/Zone assignée</Label>
                <Select defaultValue={editingStaff?.store || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une boutique" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Toutes les boutiques">Toutes les boutiques</SelectItem>
                    <SelectItem value="Boutique Plateau">Boutique Plateau</SelectItem>
                    <SelectItem value="Boutique Parcelles">Boutique Parcelles</SelectItem>
                    <SelectItem value="Boutique Almadies">Boutique Almadies</SelectItem>
                    <SelectItem value="Zone Almadies">Zone Almadies</SelectItem>
                    <SelectItem value="Siège social">Siège social</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Permissions</Label>
                <div className="grid gap-3 md:grid-cols-2">
                  {allPermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission.id}
                        defaultChecked={
                          editingStaff?.permissions?.includes(permission.id) ||
                          editingStaff?.permissions?.includes("all")
                        }
                      />
                      <Label htmlFor={permission.id} className="text-sm">
                        <div>
                          <p className="font-medium">{permission.name}</p>
                          <p className="text-xs text-muted-foreground">{permission.description}</p>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="isActive" defaultChecked={editingStaff?.status === "Actif" ?? true} />
                <Label htmlFor="isActive">Compte actif</Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setIsDialogOpen(false)}>
                  {editingStaff ? "Mettre à jour" : "Créer le compte"}
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
