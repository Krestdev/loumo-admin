"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Search, Plus, Edit, Trash2, Shield, Users, Lock, Key } from "lucide-react"

const roles = [
  {
    id: 1,
    name: "Super Administrateur",
    description: "Accès complet à toutes les fonctionnalités du système",
    permissions: ["all"],
    userCount: 1,
    isSystem: true,
    isActive: true,
    createdAt: "2023-01-01",
    color: "destructive",
  },
  {
    id: 2,
    name: "Administrateur",
    description: "Gestion complète des opérations commerciales",
    permissions: ["orders", "products", "inventory", "clients", "staff", "reports", "settings"],
    userCount: 2,
    isSystem: false,
    isActive: true,
    createdAt: "2023-01-15",
    color: "default",
  },
  {
    id: 3,
    name: "Gestionnaire de boutique",
    description: "Gestion d'une boutique spécifique",
    permissions: ["orders", "products", "inventory", "clients"],
    userCount: 3,
    isSystem: false,
    isActive: true,
    createdAt: "2023-02-01",
    color: "secondary",
  },
  {
    id: 4,
    name: "Vendeur",
    description: "Gestion des commandes et relation client",
    permissions: ["orders", "clients"],
    userCount: 5,
    isSystem: false,
    isActive: true,
    createdAt: "2023-02-15",
    color: "outline",
  },
  {
    id: 5,
    name: "Livreur",
    description: "Accès aux livraisons et suivi des commandes",
    permissions: ["deliveries", "orders:read"],
    userCount: 8,
    isSystem: false,
    isActive: true,
    createdAt: "2023-03-01",
    color: "outline",
  },
  {
    id: 6,
    name: "Comptable",
    description: "Gestion financière et rapports",
    permissions: ["payments", "reports", "orders:read"],
    userCount: 2,
    isSystem: false,
    isActive: true,
    createdAt: "2023-03-15",
    color: "outline",
  },
  {
    id: 7,
    name: "Stagiaire",
    description: "Accès limité pour formation",
    permissions: ["orders:read", "products:read"],
    userCount: 0,
    isSystem: false,
    isActive: false,
    createdAt: "2023-06-01",
    color: "secondary",
  },
]

const allPermissions = [
  {
    category: "Commandes",
    permissions: [
      { id: "orders", name: "Gestion complète des commandes", description: "Créer, modifier, supprimer les commandes" },
      { id: "orders:read", name: "Lecture des commandes", description: "Consulter les commandes uniquement" },
      { id: "orders:create", name: "Créer des commandes", description: "Créer de nouvelles commandes" },
      { id: "orders:update", name: "Modifier des commandes", description: "Modifier les commandes existantes" },
    ],
  },
  {
    category: "Produits",
    permissions: [
      { id: "products", name: "Gestion complète des produits", description: "Gérer le catalogue produits" },
      { id: "products:read", name: "Lecture des produits", description: "Consulter le catalogue uniquement" },
      { id: "variants", name: "Gestion des variantes", description: "Gérer les variantes de produits" },
      { id: "categories", name: "Gestion des catégories", description: "Organiser les catégories" },
    ],
  },
  {
    category: "Inventaire",
    permissions: [
      { id: "inventory", name: "Gestion des stocks", description: "Gérer les niveaux de stock" },
      { id: "inventory:read", name: "Lecture des stocks", description: "Consulter les stocks uniquement" },
      { id: "inventory:update", name: "Mise à jour stocks", description: "Modifier les quantités en stock" },
    ],
  },
  {
    category: "Clients",
    permissions: [
      { id: "clients", name: "Gestion des clients", description: "Gérer la base clients" },
      { id: "clients:read", name: "Lecture des clients", description: "Consulter les informations clients" },
      { id: "loyalty", name: "Programme fidélité", description: "Gérer les points de fidélité" },
    ],
  },
  {
    category: "Livraisons",
    permissions: [
      { id: "deliveries", name: "Gestion des livraisons", description: "Organiser et suivre les livraisons" },
      { id: "zones", name: "Zones de livraison", description: "Configurer les zones de livraison" },
    ],
  },
  {
    category: "Finances",
    permissions: [
      { id: "payments", name: "Gestion des paiements", description: "Suivre les transactions" },
      { id: "promotions", name: "Gestion des promotions", description: "Créer et gérer les offres" },
    ],
  },
  {
    category: "Personnel",
    permissions: [
      { id: "staff", name: "Gestion du personnel", description: "Gérer l'équipe" },
      { id: "roles", name: "Gestion des rôles", description: "Configurer les rôles et permissions" },
    ],
  },
  {
    category: "Système",
    permissions: [
      { id: "reports", name: "Rapports et analytics", description: "Accès aux rapports" },
      { id: "settings", name: "Paramètres système", description: "Configuration générale" },
      { id: "notifications", name: "Gestion des notifications", description: "Configurer les alertes" },
      { id: "all", name: "Accès complet", description: "Toutes les permissions (Super Admin)" },
    ],
  },
]

export default function RolesPage() {
  const [selectedRole, setSelectedRole] = useState(roles[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<any>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (role: any) => {
    setEditingRole(role)
    setSelectedPermissions(role.permissions)
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingRole(null)
    setSelectedPermissions([])
    setIsDialogOpen(true)
  }

  const togglePermission = (permissionId: string) => {
    if (permissionId === "all") {
      setSelectedPermissions(selectedPermissions.includes("all") ? [] : ["all"])
    } else {
      setSelectedPermissions((prev) =>
        prev.includes(permissionId)
          ? prev.filter((p) => p !== permissionId)
          : [...prev.filter((p) => p !== "all"), permissionId],
      )
    }
  }

  const getPermissionName = (permissionId: string) => {
    for (const category of allPermissions) {
      const permission = category.permissions.find((p) => p.id === permissionId)
      if (permission) return permission.name
    }
    return permissionId
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Rôles & Permissions</h1>
            <p className="text-sm text-muted-foreground">Gérez les rôles et leurs permissions d'accès</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau rôle
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4 space-y-6">
        {/* Role Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total rôles</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{roles.length}</div>
              <p className="text-xs text-muted-foreground">{roles.filter((r) => r.isActive).length} actifs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs assignés</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{roles.reduce((sum, role) => sum + role.userCount, 0)}</div>
              <p className="text-xs text-muted-foreground">Total utilisateurs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Permissions disponibles</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {allPermissions.reduce((sum, cat) => sum + cat.permissions.length, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Permissions configurables</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rôles système</CardTitle>
              <Lock className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{roles.filter((r) => r.isSystem).length}</div>
              <p className="text-xs text-muted-foreground">Non modifiables</p>
            </CardContent>
          </Card>
        </div>

        {/* Permission Matrix */}
        <Card>
          <CardHeader>
            <CardTitle>Matrice des permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {allPermissions.map((category) => (
                <div key={category.category}>
                  <h4 className="font-medium mb-3">{category.category}</h4>
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {category.permissions.map((permission) => (
                      <Card key={permission.id}>
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{permission.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">{permission.description}</p>
                            </div>
                            <Badge variant="outline" className="text-xs ml-2">
                              {
                                roles.filter(
                                  (r) => r.permissions.includes(permission.id) || r.permissions.includes("all"),
                                ).length
                              }
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Recherche</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un rôle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardContent>
        </Card>

        {/* Roles Table */}
        <Card>
          <CardHeader>
            <CardTitle>Rôles ({filteredRoles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Utilisateurs</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{role.name}</p>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {role.permissions.includes("all") ? (
                          <Badge variant="destructive" className="text-xs">
                            Toutes les permissions
                          </Badge>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {role.permissions.slice(0, 3).map((perm) => (
                              <Badge key={perm} variant="outline" className="text-xs">
                                {getPermissionName(perm)}
                              </Badge>
                            ))}
                            {role.permissions.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{role.permissions.length - 3} autres
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="text-lg font-bold">{role.userCount}</div>
                        <div className="text-xs text-muted-foreground">utilisateurs</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={role.isSystem ? "destructive" : "outline"}>
                        {role.isSystem ? "Système" : "Personnalisé"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={role.isActive ? "default" : "secondary"}>
                        {role.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedRole(role)}>
                              Voir
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Détails du rôle - {selectedRole.name}</DialogTitle>
                              <DialogDescription>Permissions et informations du rôle</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <h4 className="font-medium mb-2">Informations générales</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span>Nom:</span>
                                      <span className="font-medium">{selectedRole.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Type:</span>
                                      <Badge variant={selectedRole.isSystem ? "destructive" : "outline"}>
                                        {selectedRole.isSystem ? "Système" : "Personnalisé"}
                                      </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Utilisateurs:</span>
                                      <span>{selectedRole.userCount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Créé le:</span>
                                      <span>{selectedRole.createdAt}</span>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">Description</h4>
                                  <p className="text-sm text-muted-foreground">{selectedRole.description}</p>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium mb-3">Permissions accordées</h4>
                                {selectedRole.permissions.includes("all") ? (
                                  <Badge variant="destructive" className="mb-2">
                                    Accès complet - Toutes les permissions
                                  </Badge>
                                ) : (
                                  <div className="space-y-4">
                                    {allPermissions.map((category) => {
                                      const categoryPerms = category.permissions.filter((p) =>
                                        selectedRole.permissions.includes(p.id),
                                      )
                                      if (categoryPerms.length === 0) return null

                                      return (
                                        <div key={category.category}>
                                          <h5 className="font-medium text-sm mb-2">{category.category}</h5>
                                          <div className="grid gap-2 md:grid-cols-2">
                                            {categoryPerms.map((perm) => (
                                              <div key={perm.id} className="flex items-center gap-2 p-2 border rounded">
                                                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                                <div>
                                                  <p className="text-sm font-medium">{perm.name}</p>
                                                  <p className="text-xs text-muted-foreground">{perm.description}</p>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                )}
                              </div>

                              <div className="flex gap-2">
                                {!selectedRole.isSystem && (
                                  <Button onClick={() => handleEdit(selectedRole)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Modifier
                                  </Button>
                                )}
                                <Button variant="outline">Dupliquer</Button>
                                <Button variant="outline">Voir utilisateurs</Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        {!role.isSystem && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => handleEdit(role)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add/Edit Role Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingRole ? "Modifier le rôle" : "Nouveau rôle"}</DialogTitle>
              <DialogDescription>
                {editingRole
                  ? "Modifiez les informations et permissions du rôle"
                  : "Créez un nouveau rôle avec ses permissions"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du rôle</Label>
                  <Input id="name" placeholder="Ex: Gestionnaire de boutique" defaultValue={editingRole?.name || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Couleur du badge</Label>
                  <select className="w-full p-2 border rounded" defaultValue={editingRole?.color || "outline"}>
                    <option value="default">Bleu (défaut)</option>
                    <option value="secondary">Gris</option>
                    <option value="outline">Transparent</option>
                    <option value="destructive">Rouge</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Description du rôle et de ses responsabilités..."
                  defaultValue={editingRole?.description || ""}
                />
              </div>

              <div className="space-y-4">
                <Label>Permissions</Label>
                <div className="space-y-6">
                  {allPermissions.map((category) => (
                    <div key={category.category}>
                      <h4 className="font-medium mb-3">{category.category}</h4>
                      <div className="grid gap-3 md:grid-cols-2">
                        {category.permissions.map((permission) => (
                          <div key={permission.id} className="flex items-start space-x-3 p-3 border rounded">
                            <Checkbox
                              id={permission.id}
                              checked={
                                selectedPermissions.includes(permission.id) || selectedPermissions.includes("all")
                              }
                              onCheckedChange={() => togglePermission(permission.id)}
                              disabled={selectedPermissions.includes("all") && permission.id !== "all"}
                            />
                            <div className="flex-1">
                              <Label htmlFor={permission.id} className="text-sm font-medium">
                                {permission.name}
                              </Label>
                              <p className="text-xs text-muted-foreground mt-1">{permission.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="isActive" defaultChecked={editingRole?.isActive ?? true} />
                <Label htmlFor="isActive">Rôle actif</Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setIsDialogOpen(false)}>
                  {editingRole ? "Mettre à jour" : "Créer le rôle"}
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
