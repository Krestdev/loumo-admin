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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Search, Star, Gift, TrendingUp, Users, Settings, Plus, Edit } from "lucide-react"

const loyaltySettings = {
  pointsPerEuro: 10,
  euroPerPoint: 0.01,
  minimumRedemption: 100,
  pointsExpiry: 365,
  welcomeBonus: 100,
  birthdayBonus: 50,
  referralBonus: 200,
  isActive: true,
}

const loyaltyTiers = [
  {
    id: 1,
    name: "Bronze",
    minPoints: 0,
    maxPoints: 999,
    multiplier: 1.0,
    benefits: ["Points standards", "Offres spéciales"],
    color: "#CD7F32",
    memberCount: 1847,
  },
  {
    id: 2,
    name: "Argent",
    minPoints: 1000,
    maxPoints: 4999,
    multiplier: 1.2,
    benefits: ["20% de points bonus", "Livraison prioritaire", "Support prioritaire"],
    color: "#C0C0C0",
    memberCount: 456,
  },
  {
    id: 3,
    name: "Or",
    minPoints: 5000,
    maxPoints: 9999,
    multiplier: 1.5,
    benefits: ["50% de points bonus", "Livraison gratuite", "Accès aux ventes privées"],
    color: "#FFD700",
    memberCount: 89,
  },
  {
    id: 4,
    name: "Platine",
    minPoints: 10000,
    maxPoints: null,
    multiplier: 2.0,
    benefits: ["100% de points bonus", "Gestionnaire dédié", "Cadeaux exclusifs"],
    color: "#E5E4E2",
    memberCount: 23,
  },
]

const recentTransactions = [
  {
    id: 1,
    customer: "Marie Dubois",
    type: "Gain",
    points: 458,
    reason: "Achat commande #ORD-001",
    date: "2024-01-15 14:30",
    balance: 2450,
  },
  {
    id: 2,
    customer: "Amadou Ba",
    type: "Utilisation",
    points: -200,
    reason: "Réduction sur commande #ORD-002",
    date: "2024-01-15 09:15",
    balance: 1690,
  },
  {
    id: 3,
    customer: "Fatou Sall",
    type: "Gain",
    points: 325,
    reason: "Achat commande #ORD-003",
    date: "2024-01-14 16:45",
    balance: 975,
  },
  {
    id: 4,
    customer: "Ousmane Diop",
    type: "Bonus",
    points: 100,
    reason: "Bonus anniversaire",
    date: "2024-01-14 10:00",
    balance: 3300,
  },
  {
    id: 5,
    customer: "Aissatou Ba",
    type: "Gain",
    points: 156,
    reason: "Achat commande #ORD-005",
    date: "2024-01-13 18:20",
    balance: 1156,
  },
]

const rewards = [
  {
    id: 1,
    name: "Réduction 5€",
    pointsCost: 500,
    type: "Réduction",
    value: 5,
    description: "5€ de réduction sur votre prochaine commande",
    isActive: true,
    usageCount: 234,
    stock: null,
  },
  {
    id: 2,
    name: "Livraison gratuite",
    pointsCost: 200,
    type: "Service",
    value: 0,
    description: "Livraison gratuite sur votre prochaine commande",
    isActive: true,
    usageCount: 567,
    stock: null,
  },
  {
    id: 3,
    name: "Produit gratuit - Savon",
    pointsCost: 800,
    type: "Produit",
    value: 8.4,
    description: "Pack de 6 savons de Marseille offert",
    isActive: true,
    usageCount: 89,
    stock: 50,
  },
  {
    id: 4,
    name: "Réduction 10€",
    pointsCost: 1000,
    type: "Réduction",
    value: 10,
    description: "10€ de réduction sur votre prochaine commande",
    isActive: true,
    usageCount: 156,
    stock: null,
  },
  {
    id: 5,
    name: "Panier surprise",
    pointsCost: 1500,
    type: "Produit",
    value: 25,
    description: "Panier de produits surprise d'une valeur de 25€",
    isActive: false,
    usageCount: 23,
    stock: 0,
  },
]

export default function LoyaltyPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isRewardDialogOpen, setIsRewardDialogOpen] = useState(false)
  const [editingReward, setEditingReward] = useState<any>(null)

  const filteredTransactions = recentTransactions.filter(
    (transaction) =>
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reason.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredRewards = rewards.filter((reward) => {
    const matchesSearch = reward.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || reward.type === typeFilter
    return matchesSearch && matchesType
  })

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "Gain":
        return "default"
      case "Bonus":
        return "secondary"
      case "Utilisation":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getTierByPoints = (points: number) => {
    return (
      loyaltyTiers.find((tier) => points >= tier.minPoints && (tier.maxPoints === null || points <= tier.maxPoints)) ||
      loyaltyTiers[0]
    )
  }

  const handleEditReward = (reward: any) => {
    setEditingReward(reward)
    setIsRewardDialogOpen(true)
  }

  const handleAddReward = () => {
    setEditingReward(null)
    setIsRewardDialogOpen(true)
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Programme de fidélité</h1>
            <p className="text-sm text-muted-foreground">Gérez les points et récompenses de vos clients</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsSettingsOpen(true)}>
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4 space-y-6">
        {/* Loyalty Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Points distribués</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">245,680</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> ce mois
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Points utilisés</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89,340</div>
              <p className="text-xs text-muted-foreground">36% du total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Membres actifs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,415</div>
              <p className="text-xs text-muted-foreground">85% des clients</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux d'engagement</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">67%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+5%</span> vs mois dernier
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Loyalty Tiers */}
        <Card>
          <CardHeader>
            <CardTitle>Niveaux de fidélité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {loyaltyTiers.map((tier) => (
                <Card key={tier.id} className="relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: tier.color }} />
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium" style={{ color: tier.color }}>
                        {tier.name}
                      </h3>
                      <Badge variant="outline">{tier.memberCount} membres</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Points requis:</strong> {tier.minPoints.toLocaleString()}
                        {tier.maxPoints && ` - ${tier.maxPoints.toLocaleString()}`}
                      </p>
                      <p>
                        <strong>Multiplicateur:</strong> x{tier.multiplier}
                      </p>
                      <div>
                        <strong>Avantages:</strong>
                        <ul className="mt-1 space-y-1">
                          {tier.benefits.map((benefit, index) => (
                            <li key={index} className="text-xs text-muted-foreground">
                              • {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="rewards">Récompenses</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-6">
            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle>Recherche</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par client..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Transactions Table */}
            <Card>
              <CardHeader>
                <CardTitle>Transactions récentes ({filteredTransactions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Raison</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Solde</TableHead>
                      <TableHead>Niveau</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => {
                      const tier = getTierByPoints(transaction.balance)
                      return (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">{transaction.customer}</TableCell>
                          <TableCell>
                            <Badge variant={getTransactionTypeColor(transaction.type)}>{transaction.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <span className={transaction.points > 0 ? "text-green-600" : "text-red-600"}>
                              {transaction.points > 0 ? "+" : ""}
                              {transaction.points}
                            </span>
                          </TableCell>
                          <TableCell>{transaction.reason}</TableCell>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              {transaction.balance.toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge style={{ backgroundColor: tier.color, color: "white" }}>{tier.name}</Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
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
                        placeholder="Rechercher une récompense..."
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
                      <SelectItem value="Réduction">Réduction</SelectItem>
                      <SelectItem value="Service">Service</SelectItem>
                      <SelectItem value="Produit">Produit</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddReward}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle récompense
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Rewards Table */}
            <Card>
              <CardHeader>
                <CardTitle>Récompenses ({filteredRewards.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Récompense</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Coût (points)</TableHead>
                      <TableHead>Valeur</TableHead>
                      <TableHead>Utilisations</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRewards.map((reward) => (
                      <TableRow key={reward.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{reward.name}</p>
                            <p className="text-sm text-muted-foreground">{reward.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{reward.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            {reward.pointsCost.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          {reward.type === "Réduction" && `€${reward.value}`}
                          {reward.type === "Service" && "Gratuit"}
                          {reward.type === "Produit" && `€${reward.value}`}
                        </TableCell>
                        <TableCell>{reward.usageCount}</TableCell>
                        <TableCell>
                          {reward.stock === null ? (
                            <Badge variant="outline">Illimité</Badge>
                          ) : (
                            <span className={reward.stock === 0 ? "text-red-600" : ""}>{reward.stock}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={reward.isActive ? "default" : "secondary"}>
                            {reward.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditReward(reward)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Settings Dialog */}
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Paramètres du programme de fidélité</DialogTitle>
              <DialogDescription>Configurez les règles et taux du programme</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="pointsPerEuro">Points par euro dépensé</Label>
                  <Input id="pointsPerEuro" type="number" defaultValue={loyaltySettings.pointsPerEuro} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="euroPerPoint">Valeur d'un point (€)</Label>
                  <Input id="euroPerPoint" type="number" step="0.01" defaultValue={loyaltySettings.euroPerPoint} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="minimumRedemption">Points minimum pour échanger</Label>
                  <Input id="minimumRedemption" type="number" defaultValue={loyaltySettings.minimumRedemption} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pointsExpiry">Expiration des points (jours)</Label>
                  <Input id="pointsExpiry" type="number" defaultValue={loyaltySettings.pointsExpiry} />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Bonus automatiques</Label>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="welcomeBonus">Bonus de bienvenue</Label>
                    <Input id="welcomeBonus" type="number" defaultValue={loyaltySettings.welcomeBonus} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthdayBonus">Bonus anniversaire</Label>
                    <Input id="birthdayBonus" type="number" defaultValue={loyaltySettings.birthdayBonus} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referralBonus">Bonus parrainage</Label>
                    <Input id="referralBonus" type="number" defaultValue={loyaltySettings.referralBonus} />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="isActive" defaultChecked={loyaltySettings.isActive} />
                <Label htmlFor="isActive">Programme de fidélité actif</Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setIsSettingsOpen(false)}>Sauvegarder</Button>
                <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Reward Dialog */}
        <Dialog open={isRewardDialogOpen} onOpenChange={setIsRewardDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingReward ? "Modifier la récompense" : "Nouvelle récompense"}</DialogTitle>
              <DialogDescription>
                {editingReward ? "Modifiez les détails de la récompense" : "Créez une nouvelle récompense"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="rewardName">Nom de la récompense</Label>
                  <Input id="rewardName" placeholder="Ex: Réduction 5€" defaultValue={editingReward?.name || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rewardType">Type</Label>
                  <Select defaultValue={editingReward?.type || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Réduction">Réduction</SelectItem>
                      <SelectItem value="Service">Service</SelectItem>
                      <SelectItem value="Produit">Produit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rewardDescription">Description</Label>
                <Input
                  id="rewardDescription"
                  placeholder="Description de la récompense..."
                  defaultValue={editingReward?.description || ""}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="pointsCost">Coût en points</Label>
                  <Input id="pointsCost" type="number" defaultValue={editingReward?.pointsCost || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rewardValue">Valeur (€)</Label>
                  <Input id="rewardValue" type="number" step="0.01" defaultValue={editingReward?.value || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rewardStock">Stock (optionnel)</Label>
                  <Input
                    id="rewardStock"
                    type="number"
                    placeholder="Illimité"
                    defaultValue={editingReward?.stock || ""}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="rewardActive" defaultChecked={editingReward?.isActive ?? true} />
                <Label htmlFor="rewardActive">Récompense active</Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setIsRewardDialogOpen(false)}>
                  {editingReward ? "Mettre à jour" : "Créer la récompense"}
                </Button>
                <Button variant="outline" onClick={() => setIsRewardDialogOpen(false)}>
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
