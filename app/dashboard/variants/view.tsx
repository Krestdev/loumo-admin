'use client'
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader } from '@/components/ui/dialog';
import { XAF } from '@/lib/utils';
import { Product, ProductVariant } from '@/types/types';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Edit } from 'lucide-react';
import React from 'react'

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  variant: ProductVariant;
  products: Product[];
};

function ViewVariant({isOpen, openChange, variant, products}:Props) {
  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{`${variant.name}`}</DialogTitle>
                <DialogDescription>{"Détails de la variante"}</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                  <img
                                    src={variant.imgUrl ? variant.imgUrl : "/images/placeholder.svg"}
                                    alt={variant.name}
                                    className="h-20 w-20 rounded-md object-cover"
                                  />
                                  <div>
                                    <h3 className="text-lg font-medium">{products.find(x=>x.id === variant.productId)?.name || "Non défini"}</h3>
                                    <p className="text-muted-foreground">{variant.name}</p>
                                    <div className="flex gap-2 mt-2">
                                      {/* {selectedVariant.isDefault && (
                                        <Badge variant="default">Variante par défaut</Badge>
                                      )} */}
                                      <Badge variant={variant.status ? "default" : "secondary"}>
                                        {variant.status ? "Actif" : "Désactivé"}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <h4 className="font-medium mb-2">{"Prix et stock"}</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span>{"Prix de vente:"}</span>
                                        <span className="font-medium">{XAF.format(variant.price)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>{"Stock total:"}</span>
                                        <span className="font-medium">{variant.stock.quantity ? variant.stock.quantity : "Non défini"}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline">{"Dupliquer"}</Button>
                                  <Button variant="outline">{"Gérer stock"}</Button>
                                </div>
                              </div>
        </DialogContent>
    </Dialog>
  )
}

export default ViewVariant