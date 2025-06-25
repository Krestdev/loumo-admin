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
import { Search, CreditCard, Smartphone, Banknote, AlertCircle, CheckCircle, Clock, Download } from "lucide-react"

const payments = [
  {
    id: "PAY-001",
    orderId: "#ORD-001",
    customer: "Marie Dubois",
    amount: 45.8,
    method: "Carte bancaire",
    provider: "Visa **** 1234",
    status: "Réussi",
    date: "2024-01-15 14:32",
    transactionId: "txn_1234567890",
    fees: 1.2,
    netAmount: 44.6,
  },
  {
    id: "PAY-002",
    orderId: "#ORD-002",
    customer: "Amadou Ba",
    amount: 78.2,
    method: "Mobile Money",
    provider: "Orange Money",
    status: "Réussi",
    date: "2024-01-15 09:18",
    transactionId: "om_9876543210",
    fees: 2.1,
    netAmount: 76.1,
  },
  {
    id: "PAY-003",
    orderId: "#ORD-003",
    customer: "Fatou Sall",
    amount: 32.5,
    method: "Espèces",
    provider: "Paiement à la livraison",
    status: "En attente",
    date: "2024-01-15 16:45",
    transactionId: "cash_001",
    fees: 0,
    netAmount: 32.5,
  },
  {
    id: "PAY-004",
    orderId: "#ORD-004",
    customer: "Ousmane Diop",
    amount: 91.3,
    method: "Virement bancaire",
    provider: "CBAO Groupe Attijariwafa Bank",
    status: "Échoué",
    date: "2024-01-14 11:22",
    transactionId: "wire_5555666677",
    fees: 0,
    netAmount: 0,
    failureReason: "Fonds insuffisants",
  },
  {
    id: "PAY-005",
    orderId: "#ORD-005",
    customer: "Aissatou Diallo",
    amount: 156.4,
    method: "Mobile Money",
    provider: "Wave",
    status: "En cours",
    date: "2024-01-15 18:10",
    transactionId: "wave_1111222233",
    fees: 3.2,
    netAmount: 153.2,
  },
]

const paymentMethods = [
  {
    name: "Carte bancaire",
    icon: CreditCard,
    enabled: true,
    fees: "2.5%",
    transactions: 156,
    volume: 12450.8,
  },
  {
    name: "Mobile Money",
    icon: Smartphone,
    enabled: true,
    fees: "1.8%",
    transactions: 203,
    volume: 8920.5,
  },
  {
    name: "Espèces",
    icon: Banknote,
    enabled: true,
    fees: "0%",
    transactions: 89,
    volume: 3240.2,
  },
  {
    name: "Virement bancaire",
    icon: CreditCard,
    enabled: false,
    fees: "0.5%",
    transactions: 12,
    volume: 890.3,
  },
]

export default function PaymentsPage() {
  const [selectedPayment, setSelectedPayment] = useState(payments[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [methodFilter, setMethodFilter] = useState("all")

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    const matchesMethod = methodFilter === "all" || payment.method === methodFilter
    return matchesSearch && matchesStatus && matchesMethod
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Réussi":
        return "default"
      case "En cours":
        return "secondary"
      case "En attente":
        return "outline"
      case "Échoué":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Réussi":
        return CheckCircle
      case "En cours":
        return Clock
      case "En attente":
        return Clock
      case "Échoué":
        return AlertCircle
      default:
        return Clock
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "Carte bancaire":
        return CreditCard
      case "Mobile Money":
        return Smartphone
      case "Espèces":
        return Banknote
      case "Virement bancaire":
        return CreditCard
      default:
        return CreditCard
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Gestion des paiements</h1>
            <p className="text-sm text-muted-foreground">Suivez les transactions et méthodes de paiement</p>
          </div>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4 space-y-6">
        {/* Payment Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Volume aujourd'hui</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€2,847</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12.5%</span> vs hier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions réussies</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.2%</div>
              <p className="text-xs text-muted-foreground">Taux de réussite</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Paiements à traiter</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Frais totaux</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€156</div>
              <p className="text-xs text-muted-foreground">Ce mois</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Méthodes de paiement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method, index) => {
                  const Icon = method.icon
                  return (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-muted-foreground">Frais: {method.fees}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={method.enabled ? "default" : "secondary"}>
                          {method.enabled ? "Actif" : "Inactif"}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">{method.transactions} trans.</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Transactions récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.slice(0, 5).map((payment) => {
                  const StatusIcon = getStatusIcon(payment.status)
                  const MethodIcon = getMethodIcon(payment.method)
                  return (
                    <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <MethodIcon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{payment.customer}</p>
                          <p className="text-sm text-muted-foreground">
                            {payment.orderId} • {payment.method}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">€{payment.amount.toFixed(2)}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <StatusIcon className="h-3 w-3" />
                          <Badge variant={getStatusColor(payment.status)} className="text-xs">
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
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
                    placeholder="Rechercher par client, commande ou ID..."
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
                  <SelectItem value="Réussi">Réussi</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="Échoué">Échoué</SelectItem>
                </SelectContent>
              </Select>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Méthode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="Carte bancaire">Carte bancaire</SelectItem>
                  <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                  <SelectItem value="Espèces">Espèces</SelectItem>
                  <SelectItem value="Virement bancaire">Virement bancaire</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Toutes les transactions ({filteredPayments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Transaction</TableHead>
                  <TableHead>Commande</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Méthode</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => {
                  const StatusIcon = getStatusIcon(payment.status)
                  const MethodIcon = getMethodIcon(payment.method)
                  return (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{payment.orderId}</TableCell>
                      <TableCell>{payment.customer}</TableCell>
                      <TableCell>€{payment.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MethodIcon className="h-4 w-4" />
                          <span>{payment.method}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <StatusIcon className="h-3 w-3" />
                          <Badge variant={getStatusColor(payment.status)}>{payment.status}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedPayment(payment)}>
                              Détails
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Détails de la transaction {selectedPayment.id}</DialogTitle>
                              <DialogDescription>Informations complètes sur le paiement</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <h4 className="font-medium mb-2">Informations générales</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span>ID Transaction:</span>
                                      <span className="font-medium">{selectedPayment.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Commande:</span>
                                      <span className="font-medium">{selectedPayment.orderId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Client:</span>
                                      <span className="font-medium">{selectedPayment.customer}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Date:</span>
                                      <span>{selectedPayment.date}</span>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">Détails du paiement</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span>Méthode:</span>
                                      <span className="font-medium">{selectedPayment.method}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Fournisseur:</span>
                                      <span>{selectedPayment.provider}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>ID Transaction:</span>
                                      <span className="font-mono text-xs">{selectedPayment.transactionId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Statut:</span>
                                      <Badge variant={getStatusColor(selectedPayment.status)}>
                                        {selectedPayment.status}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="border-t pt-4">
                                <h4 className="font-medium mb-2">Détails financiers</h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span>Montant brut:</span>
                                    <span>€{selectedPayment.amount.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Frais de transaction:</span>
                                    <span>€{selectedPayment.fees.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between font-medium border-t pt-2">
                                    <span>Montant net:</span>
                                    <span>€{selectedPayment.netAmount.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>

                              {selectedPayment.status === "Échoué" && selectedPayment.failureReason && (
                                <div className="border-t pt-4">
                                  <h4 className="font-medium mb-2 text-red-600">Raison de l'échec</h4>
                                  <p className="text-sm text-red-600">{selectedPayment.failureReason}</p>
                                </div>
                              )}

                              <div className="flex gap-2">
                                <Button>
                                  <Download className="mr-2 h-4 w-4" />
                                  Télécharger reçu
                                </Button>
                                {selectedPayment.status === "Échoué" && (
                                  <Button variant="outline">Relancer paiement</Button>
                                )}
                              </div>
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
      </main>
    </div>
  )
}
