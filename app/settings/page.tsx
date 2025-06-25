"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Bell,
  Shield,
  Palette,
  Database,
  Mail,
  Smartphone,
  Globe,
  CreditCard,
  Truck,
  Package,
} from "lucide-react"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    orders: true,
    inventory: true,
    payments: false,
  })

  const [appearance, setAppearance] = useState({
    theme: "light",
    language: "fr",
    currency: "MAD",
    timezone: "Africa/Casablanca",
  })

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Paramètres</h2>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
          <TabsTrigger value="integrations">Intégrations</TabsTrigger>
          <TabsTrigger value="advanced">Avancé</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Informations Générales</span>
                </CardTitle>
                <CardDescription>Configurez les paramètres de base de votre plateforme</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Nom de l'entreprise</Label>
                    <Input id="company-name" defaultValue="Oumoul" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Site web</Label>
                    <Input id="website" defaultValue="https://oumoul.ma" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    defaultValue="Plateforme e-commerce spécialisée dans la vente en gros de produits alimentaires et ménagers au Maroc."
                    className="min-h-[80px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone principal</Label>
                    <Input id="phone" defaultValue="+212 522 123 456" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email de contact</Label>
                    <Input id="email" defaultValue="contact@oumoul.ma" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse du siège</Label>
                  <Textarea
                    id="address"
                    defaultValue="123 Avenue Mohammed V, Casablanca 20000, Maroc"
                    className="min-h-[60px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Paramètres de Commande</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-order">Commande minimum (MAD)</Label>
                    <Input id="min-order" type="number" defaultValue="200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="free-shipping">Livraison gratuite à partir de (MAD)</Label>
                    <Input id="free-shipping" type="number" defaultValue="500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="processing-time">Délai de traitement (heures)</Label>
                    <Input id="processing-time" type="number" defaultValue="24" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="auto-confirm" defaultChecked />
                  <Label htmlFor="auto-confirm">Confirmation automatique des commandes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="inventory-check" defaultChecked />
                  <Label htmlFor="inventory-check">Vérification automatique du stock</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="h-5 w-5" />
                  <span>Paramètres de Livraison</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="delivery-fee">Frais de livraison standard (MAD)</Label>
                    <Input id="delivery-fee" type="number" defaultValue="30" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="express-fee">Frais de livraison express (MAD)</Label>
                    <Input id="express-fee" type="number" defaultValue="50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery-zones">Zones de livraison</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Casablanca</Badge>
                    <Badge variant="outline">Rabat</Badge>
                    <Badge variant="outline">Salé</Badge>
                    <Badge variant="outline">Mohammedia</Badge>
                    <Button variant="outline" size="sm">
                      + Ajouter une zone
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Préférences de Notification</span>
              </CardTitle>
              <CardDescription>Configurez comment et quand vous souhaitez recevoir les notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Canaux de notification</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <Label htmlFor="email-notif">Notifications par email</Label>
                    </div>
                    <Switch
                      id="email-notif"
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="h-4 w-4" />
                      <Label htmlFor="sms-notif">Notifications par SMS</Label>
                    </div>
                    <Switch
                      id="sms-notif"
                      checked={notifications.sms}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4" />
                      <Label htmlFor="push-notif">Notifications push</Label>
                    </div>
                    <Switch
                      id="push-notif"
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Types de notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="orders-notif">Nouvelles commandes</Label>
                    <Switch
                      id="orders-notif"
                      checked={notifications.orders}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, orders: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="inventory-notif">Alertes de stock</Label>
                    <Switch
                      id="inventory-notif"
                      checked={notifications.inventory}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, inventory: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="payments-notif">Confirmations de paiement</Label>
                    <Switch
                      id="payments-notif"
                      checked={notifications.payments}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, payments: checked })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Horaires de notification</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quiet-start">Début du mode silencieux</Label>
                    <Input id="quiet-start" type="time" defaultValue="22:00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quiet-end">Fin du mode silencieux</Label>
                    <Input id="quiet-end" type="time" defaultValue="08:00" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Paramètres de Sécurité</span>
              </CardTitle>
              <CardDescription>Gérez la sécurité et l'accès à votre compte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Authentification</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="2fa">Authentification à deux facteurs (2FA)</Label>
                    <Switch id="2fa" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-alerts">Alertes de connexion</Label>
                    <Switch id="login-alerts" defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Politique de mot de passe</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-length">Longueur minimale</Label>
                    <Input id="min-length" type="number" defaultValue="8" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiration (jours)</Label>
                    <Input id="expiry" type="number" defaultValue="90" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch id="require-uppercase" defaultChecked />
                    <Label htmlFor="require-uppercase">Exiger des majuscules</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="require-numbers" defaultChecked />
                    <Label htmlFor="require-numbers">Exiger des chiffres</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="require-symbols" />
                    <Label htmlFor="require-symbols">Exiger des symboles</Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Sessions et accès</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Timeout de session (minutes)</Label>
                    <Input id="session-timeout" type="number" defaultValue="30" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-attempts">Tentatives de connexion max</Label>
                    <Input id="max-attempts" type="number" defaultValue="5" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Apparence et Localisation</span>
              </CardTitle>
              <CardDescription>Personnalisez l'apparence et les paramètres régionaux</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Thème</Label>
                  <Select
                    value={appearance.theme}
                    onValueChange={(value) => setAppearance({ ...appearance, theme: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Clair</SelectItem>
                      <SelectItem value="dark">Sombre</SelectItem>
                      <SelectItem value="system">Système</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Langue</Label>
                  <Select
                    value={appearance.language}
                    onValueChange={(value) => setAppearance({ ...appearance, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Devise</Label>
                  <Select
                    value={appearance.currency}
                    onValueChange={(value) => setAppearance({ ...appearance, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MAD">MAD (Dirham)</SelectItem>
                      <SelectItem value="EUR">EUR (Euro)</SelectItem>
                      <SelectItem value="USD">USD (Dollar)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuseau horaire</Label>
                  <Select
                    value={appearance.timezone}
                    onValueChange={(value) => setAppearance({ ...appearance, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Casablanca">Casablanca (GMT+1)</SelectItem>
                      <SelectItem value="Europe/Paris">Paris (GMT+1)</SelectItem>
                      <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Format d'affichage</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Format de date</Label>
                    <Select defaultValue="dd/mm/yyyy">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number-format">Format des nombres</Label>
                    <Select defaultValue="1,234.56">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1,234.56">1,234.56</SelectItem>
                        <SelectItem value="1 234,56">1 234,56</SelectItem>
                        <SelectItem value="1.234,56">1.234,56</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Intégrations Externes</span>
              </CardTitle>
              <CardDescription>Configurez les intégrations avec des services tiers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Paiements</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-8 w-8 text-blue-600" />
                      <div>
                        <h5 className="font-medium">CMI Payment Gateway</h5>
                        <p className="text-sm text-muted-foreground">Passerelle de paiement principale</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">Connecté</Badge>
                      <Button variant="outline" size="sm">
                        Configurer
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-8 w-8 text-orange-600" />
                      <div>
                        <h5 className="font-medium">PayPal</h5>
                        <p className="text-sm text-muted-foreground">Paiements internationaux</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Non connecté</Badge>
                      <Button variant="outline" size="sm">
                        Connecter
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Livraison</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Truck className="h-8 w-8 text-red-600" />
                      <div>
                        <h5 className="font-medium">Amana</h5>
                        <p className="text-sm text-muted-foreground">Service de livraison national</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">Connecté</Badge>
                      <Button variant="outline" size="sm">
                        Configurer
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Truck className="h-8 w-8 text-blue-600" />
                      <div>
                        <h5 className="font-medium">Jumia Logistics</h5>
                        <p className="text-sm text-muted-foreground">Réseau de livraison étendu</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Non connecté</Badge>
                      <Button variant="outline" size="sm">
                        Connecter
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Communication</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-8 w-8 text-blue-600" />
                      <div>
                        <h5 className="font-medium">SendGrid</h5>
                        <p className="text-sm text-muted-foreground">Service d'envoi d'emails</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">Connecté</Badge>
                      <Button variant="outline" size="sm">
                        Configurer
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-8 w-8 text-green-600" />
                      <div>
                        <h5 className="font-medium">Twilio SMS</h5>
                        <p className="text-sm text-muted-foreground">Service d'envoi de SMS</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Non connecté</Badge>
                      <Button variant="outline" size="sm">
                        Connecter
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Paramètres Avancés</span>
              </CardTitle>
              <CardDescription>Configuration technique et maintenance du système</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Base de données</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="backup-frequency">Fréquence de sauvegarde</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Toutes les heures</SelectItem>
                        <SelectItem value="daily">Quotidienne</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retention">Rétention des sauvegardes (jours)</Label>
                    <Input id="retention" type="number" defaultValue="30" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="auto-backup" defaultChecked />
                  <Label htmlFor="auto-backup">Sauvegarde automatique</Label>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Performance</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cache-duration">Durée du cache (minutes)</Label>
                    <Input id="cache-duration" type="number" defaultValue="60" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-connections">Connexions simultanées max</Label>
                    <Input id="max-connections" type="number" defaultValue="1000" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="compression" defaultChecked />
                  <Label htmlFor="compression">Compression des données</Label>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Logs et monitoring</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="log-level">Niveau de log</Label>
                    <Select defaultValue="info">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debug">Debug</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="log-retention">Rétention des logs (jours)</Label>
                    <Input id="log-retention" type="number" defaultValue="90" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch id="error-tracking" defaultChecked />
                    <Label htmlFor="error-tracking">Suivi des erreurs</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="performance-monitoring" defaultChecked />
                    <Label htmlFor="performance-monitoring">Monitoring des performances</Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Maintenance</h4>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="mr-2 h-4 w-4" />
                    Optimiser la base de données
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="mr-2 h-4 w-4" />
                    Vider le cache
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Reconstruire l'index de recherche
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Annuler</Button>
        <Button>Enregistrer les modifications</Button>
      </div>
    </div>
  )
}
