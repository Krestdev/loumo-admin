'use client'
import SwitchLabel from '@/components/switchLabel';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import RequiredStar from '@/components/ui/requiredStar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { formatName } from '@/lib/utils';
import ProductQuery from '@/queries/product';
import { Category, Product } from '@/types/types';
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from "zod";

type Props = {
    product: Product;
    isOpen: boolean;
    openChange: React.Dispatch<React.SetStateAction<boolean>>;
    categories : Category[];
}

const formSchema = z.object({
    name: z.string({message: "Veuillez entrer un nom"}),
    category: z.string({message: "Veuillez sélectionner une catégorie"}),
    status: z.boolean(),
    description: z.string({message: "Veuillez renseigner une description du produit"}).min(40, {message: "Description trop courte"})
})

function EditProduct({product, categories, isOpen, openChange}:Props) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: product.name,
            category: String(product.categoryId),
            status: product.status,
            description: product.description,
        }
    });
    const onSubmit = (values:z.infer<typeof formSchema>)=>{
        //console.log(values);
        productUpdate.mutate(values);
    }
    const actions = new ProductQuery();
    const queryClient = useQueryClient();
    const productUpdate = useMutation({
        mutationFn: (values:z.infer<typeof formSchema>) => actions.update(product.id, {
            name: formatName(values.name),
            status: values.status,
            categoryId: Number(values.category),
            description: values.description,
        }),
        onSuccess: ()=> {
            queryClient.invalidateQueries({queryKey: ["products"], refetchType: "active"})
            queryClient.invalidateQueries({queryKey: ["categories"], refetchType: "active"})
            openChange(false);
        },
    });

    React.useEffect(() => {
  if (isOpen && product) {
    form.reset({
      name: product.name,
            category: String(product.categoryId),
            status: product.status
    });
  }
}, [product, isOpen, form]); 
  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {"Modifier le produit"}
            </DialogTitle>
            <DialogDescription>
              {"Modifiez les informations du produit"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{"Informations générales"}</h3>
              <div className="grid gap-4 md:grid-cols-2 place-items-start">
                    <FormField control={form.control} name="name" render={({field})=>(
                        <FormItem>
                            <FormLabel>{"Nom du Produit"}<RequiredStar/></FormLabel>
                            <FormControl>
                                <Input {...field} placeholder='Entrer le nom du produit' />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )} />
                <FormField control={form.control} name="category" render={({field})=>(
                    <FormItem>
                        <FormLabel>{"Catégorie"}<RequiredStar/></FormLabel>
                        <FormControl>
                            <Select defaultValue={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat)=> (
                  <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                ))}
                    </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )} />
                <FormField control={form.control} name="description" render={({field})=>(
                  <FormItem>
                    <FormLabel>{"Description"}<RequiredStar/></FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Description du produit"/>
                    </FormControl>
                  </FormItem>
                )} />
              </div>
            </div>

            {/* Status */}
              <FormField control={form.control} name="status" render={({field})=> (
                <FormItem>
                    <FormLabel>{"Statut du Produit"}</FormLabel>
                        <FormControl>
                            <SwitchLabel {...field} name="Statut du Produit" />
                        </FormControl>
                    <FormMessage/>
                </FormItem>
              )}/>

            <div className="flex gap-2">
              <Button type='submit' disabled={productUpdate.isPending}>
                {"Mettre à jour"}
                {productUpdate.isPending && <Loader className='animate-spin' size={16}/>}
              </Button>
              <Button
                variant="outline"
                onClick={(e) =>{e.preventDefault(); form.reset(); openChange(false)}}
              >
                {"Annuler"}
              </Button>
            </div>
            </form>
          </Form>
          
        </DialogContent>
      </Dialog>
  )
}

export default EditProduct