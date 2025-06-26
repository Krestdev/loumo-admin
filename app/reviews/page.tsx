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
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Flag,
  MoreHorizontal,
  Eye,
  Reply,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react"

export default function ReviewsPage() {
  const [selectedReview, setSelectedReview] = useState(null)
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false)

  const reviews = [
    {
      id: 1,
      customer: "Amina Benali",
      product: "Riz Basmati 5kg",
      rating: 5,
      title: "Excellent produit, très satisfaite",
      comment:
        "Le riz est de très bonne qualité, les grains sont longs et parfumés. Livraison rapide et emballage soigné. Je recommande vivement !",
      date: "2024-01-15",
      status: "approved",
      helpful: 12,
      notHelpful: 1,
      verified: true,
      response: null,
      images: ["product1.jpg", "product2.jpg"],
    },
    {
      id: 2,
      customer: "Mohamed Tazi",
      product: "Huile d'olive 1L",
      rating: 4,
      title: "Bonne qualité mais prix élevé",
      comment:
        "L'huile d'olive est authentique et savoureuse. Cependant, je trouve le prix un peu élevé par rapport à la concurrence.",
      date: "2024-01-14",
      status: "pending",
      helpful: 8,
      notHelpful: 3,
      verified: true,
      response: null,
      images: [],
    },
    {
      id: 3,
      customer: "Sarah Alami",
      product: "Pâtes Spaghetti 500g",
      rating: 2,
      title: "Déçue de la qualité",
      comment:
        "Les pâtes se cassent facilement et la texture n'est pas satisfaisante après cuisson. Je ne recommande pas ce produit.",
      date: "2024-01-13",
      status: "flagged",
      helpful: 5,
      notHelpful: 8,
      verified: false,
      response: {
        author: "Équipe Oumoul",
        message:
          "Nous sommes désolés de votre expérience. Nous allons examiner ce lot et vous contacter pour un remboursement.",
        date: "2024-01-14",
      },
      images: [],
    },
    {
      id: 4,
      customer: "Youssef Bennani",
      product: "Thé vert à la menthe 200g",
      rating: 5,
      title: "Parfait pour les amateurs de thé",
      comment: "Excellent mélange, très aromatique. Le goût est authentique et rappelle le thé traditionnel marocain.",
      date: "2024-01-12",
      status: "approved",
      helpful: 15,
      notHelpful: 0,
      verified: true,
      response: {
        author: "Équipe Oumoul",
        message: "Merci beaucoup pour votre retour positif ! Nous sommes ravis que notre thé vous plaise.",
        date: "2024-01-13",
      },
      images: [],
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "flagged":
        return "bg-red-100 text-red-800"
      case "rejected":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="flagged">Signalés</TabsTrigger>
          <TabsTrigger value="analytics">Analytiques</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Avis</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reviews.length}</div>
                <p className="text-xs text-muted-foreground">+23% ce mois</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageRating.toFixed(1)}/5</div>
                <div className="flex items-center">{renderStars(Math.round(averageRating))}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En Attente</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reviews.filter((r) => r.status === "pending").length}</div>
                <p className="text-xs text-muted-foreground">Nécessitent modération</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taux de Réponse</CardTitle>
                <Reply className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((reviews.filter((r) => r.response).length / reviews.length) * 100)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {reviews.filter((r) => r.response).length} avis avec réponse
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tous les Avis</CardTitle>
              <CardDescription>Gérez et modérez les avis clients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Input placeholder="Rechercher un avis..." className="max-w-sm" />
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="approved">Approuvés</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="flagged">Signalés</SelectItem>
                    <SelectItem value="rejected">Rejetés</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Toutes les notes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les notes</SelectItem>
                    <SelectItem value="5">5 étoiles</SelectItem>
                    <SelectItem value="4">4 étoiles</SelectItem>
                    <SelectItem value="3">3 étoiles</SelectItem>
                    <SelectItem value="2">2 étoiles</SelectItem>
                    <SelectItem value="1">1 étoile</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="font-medium">{review.customer}</div>
                          {review.verified && (
                            <Badge variant="outline" className="text-xs">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Vérifié
                            </Badge>
                          )}
                          <Badge className={getStatusColor(review.status)}>
                            {review.status === "approved"
                              ? "Approuvé"
                              : review.status === "pending"
                                ? "En attente"
                                : review.status === "flagged"
                                  ? "Signalé"
                                  : "Rejeté"}
                          </Badge>
                        </div>

                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex">{renderStars(review.rating)}</div>
                          <span className="text-sm text-muted-foreground">
                            {review.product} • {review.date}
                          </span>
                        </div>

                        <h4 className="font-medium mb-1">{review.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{review.comment}</p>

                        {review.response && (
                          <div className="bg-blue-50 p-3 rounded-lg mb-3">
                            <div className="flex items-center space-x-2 mb-1">
                              <Reply className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-blue-900">{review.response.author}</span>
                              <span className="text-xs text-blue-600">{review.response.date}</span>
                            </div>
                            <p className="text-sm text-blue-800">{review.response.message}</p>
                          </div>
                        )}

                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{review.helpful}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ThumbsDown className="h-4 w-4" />
                            <span>{review.notHelpful}</span>
                          </div>
                          {review.images.length > 0 && (
                            <div className="flex items-center space-x-1">
                              <Eye className="h-4 w-4" />
                              <span>{review.images.length} image(s)</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedReview(review)
                              setIsResponseDialogOpen(true)
                            }}
                          >
                            <Reply className="mr-2 h-4 w-4" />
                            Répondre
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approuver
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Flag className="mr-2 h-4 w-4" />
                            Signaler
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Avis en Attente de Modération</CardTitle>
              <CardDescription>
                {reviews.filter((r) => r.status === "pending").length} avis nécessitent votre attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews
                  .filter((r) => r.status === "pending")
                  .map((review) => (
                    <Card key={review.id} className="p-4 border-yellow-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="font-medium">{review.customer}</div>
                            <div className="flex">{renderStars(review.rating)}</div>
                          </div>
                          <h4 className="font-medium mb-1">{review.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{review.comment}</p>
                          <div className="flex space-x-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Approuver
                            </Button>
                            <Button size="sm" variant="outline">
                              <Reply className="mr-1 h-4 w-4" />
                              Répondre
                            </Button>
                            <Button size="sm" variant="destructive">
                              <XCircle className="mr-1 h-4 w-4" />
                              Rejeter
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flagged" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Avis Signalés</CardTitle>
              <CardDescription>
                {reviews.filter((r) => r.status === "flagged").length} avis ont été signalés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews
                  .filter((r) => r.status === "flagged")
                  .map((review) => (
                    <Card key={review.id} className="p-4 border-red-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="font-medium">{review.customer}</div>
                            <div className="flex">{renderStars(review.rating)}</div>
                            <Badge className="bg-red-100 text-red-800">
                              <Flag className="mr-1 h-3 w-3" />
                              Signalé
                            </Badge>
                          </div>
                          <h4 className="font-medium mb-1">{review.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{review.comment}</p>
                          <div className="flex space-x-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Approuver quand même
                            </Button>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="mr-1 h-4 w-4" />
                              Supprimer définitivement
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = reviews.filter((r) => r.rating === rating).length
                    const percentage = (count / reviews.length) * 100
                    return (
                      <div key={rating} className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 w-16">
                          <span className="text-sm">{rating}</span>
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="text-sm text-muted-foreground w-12">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistiques Mensuelles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Nouveaux avis</span>
                    <span className="font-bold">+23</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Taux d'approbation</span>
                    <span className="font-bold">87%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Temps de réponse moyen</span>
                    <span className="font-bold">2.3h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avis avec photos</span>
                    <span className="font-bold">25%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Répondre à l'avis</DialogTitle>
            <DialogDescription>Rédigez une réponse professionnelle à cet avis client</DialogDescription>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium">{selectedReview.customer}</span>
                  <div className="flex">{renderStars(selectedReview.rating)}</div>
                </div>
                <p className="text-sm">{selectedReview.comment}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="response">Votre réponse</Label>
                <Textarea id="response" placeholder="Rédigez votre réponse..." className="min-h-[100px]" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit">Publier la réponse</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
