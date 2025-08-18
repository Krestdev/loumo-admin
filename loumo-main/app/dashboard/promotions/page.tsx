'use client'
import PageLayout from '@/components/page-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchAll } from '@/hooks/useData';
import { cn, isExpired, XAF } from '@/lib/utils';
import { useStore } from '@/providers/datastore';
import PromotionQuery from '@/queries/promotion';
import StockQuery from '@/queries/stock';
import { Promotion, Stock } from '@/types/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CirclePlus, Edit, Eye, Gift, MoreHorizontal, Percent, Search, Target, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';


function Page() {

  const promoQuery = new PromotionQuery();
  const getPromotions = fetchAll(promoQuery.getAll,"promotions");

  const stockQuery = new StockQuery();
  const getStocks = fetchAll(stockQuery.getAll,"stocks");

  const { setLoading } = useStore();

  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);

  const [selected, setSelected] = useState<Promotion>();
  const [viewDialog, setViewDialog] = useState<boolean>(false);
  const [addDialog, setAddDialog] = useState<boolean>(false);
  const [editDialog, setEditDialog] = useState<boolean>(false);
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    setLoading(getPromotions.isLoading || getStocks.isLoading);
    if (getPromotions.isSuccess) setPromotions(getPromotions.data);
    if (getStocks.isSuccess) setStocks(getStocks.data);
  }, [
    setLoading,
    setPromotions,
    setStocks,
    getPromotions.isLoading,
    getPromotions.data,
    getPromotions.isSuccess,
    getStocks.isLoading,
    getStocks.data,
    getStocks.isSuccess,
  ]);

  const filteredPromotions = useMemo(() => {
    return promotions.filter((promotion) => {
      const matchesSearch =
        promotion.code?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        String(isExpired(new Date(promotion.expireAt))) === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [promotions, searchTerm, statusFilter]);

  const handleEdit = (promotion: Promotion): void => {
    setSelected(promotion);
    setEditDialog(true);
  };
  const handleDelete = (promotion: Promotion):void => {
    setSelected(promotion);
    setDeleteDialog(true);
  }
  const handleView = (promotion:Promotion):void => {
    setSelected(promotion);
    setViewDialog(true);
  }

  const promotionsActive = promotions.filter((p) => !isExpired(p.expireAt) && p.status === "ACTIVE").length;

  const conversionRate = promotions.filter(x=>!!x.maxUses).reduce((sum, p) => sum + (p.maxUses ?? 0), 0) - promotions.filter(x=>!!x.maxUses).reduce((sum, p) => sum + p.usedCount, 0);

  return (
    <PageLayout isLoading={getPromotions.isLoading || getStocks.isLoading} className='flex-1 overflow-auto p-4 space-y-6'>
       <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{"Promotions"}</CardTitle>
              <Gift className="text-muted-foreground" size={16} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{promotions.length}</div>
              <p className="text-xs text-muted-foreground">{"Dont "}<span className={cn("px-1 py-0.5 rounded border", promotionsActive>0 ? "bg-green-100 font-semibold text-green-600 border border-green-300": "bg-gray-100")}>{promotionsActive}</span>{" en cours"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{"Utilisations ce mois"}</CardTitle>
              <Target className="text-green-500" size={16} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{promotions.reduce((sum, p) => sum + p.usedCount, 0)}</div>
{/*               <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{"+23%"}</span>{" vs mois dernier"}
              </p> */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{"Économies clients"}</CardTitle>
              <Percent className="text-muted-foreground" size={16} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{XAF.format(promotions.reduce((total, p)=>total + (p.percentage > 0 ? p.amount*p.usedCount : p.percentage*p.usedCount/100) ,0))}</div>
              <p className="text-xs text-muted-foreground">{"Total économisé"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{"Taux de conversion"}</CardTitle>
              <Target className="text-muted-foreground" size={16} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversionRate>0 ? conversionRate/promotions.filter(x=>!!x.maxUses).reduce((total, p)=>total + (p.maxUses ?? 0),0) : 0 }{"%"}</div>
              <p className="text-xs text-muted-foreground"><strong>{promotions.reduce((total, p)=> total + p.usedCount,0)}</strong>{" codes utilisés"}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>{"Filtres & Actions"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 text-muted-foreground" size={16} />
                  <Input
                    placeholder="Rechercher par nom ou code..."
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
                  <SelectItem value="all">{"Tous"}</SelectItem>
                  <SelectItem value={String(true)}>{"Actif"}</SelectItem>
                  <SelectItem value={String(false)}>{"Expiré"}</SelectItem>
                </SelectContent>
              </Select>
              <Button><CirclePlus size={16} onClick={()=>setAddDialog(true)} />{"Créer une promotion"}</Button>
            </div>
          </CardContent>
        </Card>

        {/* Promotions Table */}
        <Card>
          <CardHeader>
            <CardTitle>{`Promotions (${filteredPromotions.length})`}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{"Code"}</TableHead>
                  <TableHead>{"Description"}</TableHead>
                  <TableHead>{"Réduction"}</TableHead>
                  <TableHead>{"Expire le"}</TableHead>
                  <TableHead>{"Utilisation"}</TableHead>
                  <TableHead>{"Variante"}</TableHead>
                  <TableHead>{"Statut"}</TableHead>
                  <TableHead>{"Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  filteredPromotions.length === 0 ?
                  (
                    <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-gray-500 py-5 sm:text-lg xl:text-xl"
                  >
                    {"Aucune promotion trouvée"}
                    <img
                      src={"/images/search.png"}
                      alt="no-image"
                      className="w-1/3 max-w-32 h-auto mx-auto mt-5 opacity-20"
                    />
                  </TableCell>
                </TableRow>
                  )
                  :
                filteredPromotions.map((promotion) => (
                  <TableRow key={promotion.id}>
                    <TableCell>
                      <code className="bg-muted px-2 py-1 rounded text-sm">{promotion.code}</code>
                    </TableCell>
                    <TableCell>
                        <p>{promotion.description}</p>
                    </TableCell>
                    <TableCell>
                      <div className='text-semibold'>
                        {promotion.percentage > 0 ?
                        `-${promotion.percentage}%`:
                        `-${XAF.format(promotion.amount)}`
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{format(promotion.expireAt, "dd/MM/YYY", {locale: fr})}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{promotion.usedCount}
                          {promotion.maxUses && (
                          <span className="text-sm text-muted-foreground">/{promotion.maxUses}</span>
                        )}
                        </p> 
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={isExpired(promotion.expireAt) ? "destructive" : "outline"}>{isExpired(promotion.expireAt) ? "Expiré" : "Actif"}</Badge>
                    </TableCell>
                    <TableCell>
                      {
                        promotion.stock.length> 0 ?
                        promotion.stock.map((x,id)=>
                          <div key={id} className='mt-1'>{stocks.find(y=> x === y.id)?.productVariant?.name ?? "N/A"}</div>
                        )
                        :
                        "N/A"
                      }
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant={"ghost"} size={"sm"}>
                            <MoreHorizontal size={16}/>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={()=>handleView(promotion)}>
                            <Eye size={16}/>
                            {"Voir les détails"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={()=>handleEdit(promotion)}>
                            <Edit size={16}/>
                            {"Modifier la promotion"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={()=>handleDelete(promotion)}>
                            <Trash2 size={16}/>
                            {"Supprimer"}
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
    </PageLayout>
  );
}

export default Page