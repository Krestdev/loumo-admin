'use client'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import ProductQuery from "@/queries/product";
import { Category } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  categories: Category[];
};

const formSchema = z.object({
    name: z.string({message: "Veuillez entrer un nom"}),
    category: z.string({message: "Veuillez sélectionner une catégorie"}),
    status: z.boolean(),
    description: z.string({message: "Veuillez renseigner une description du produit"}).min(12, {message: "Description trop courte"}).max(240,{message:"240 caractères maximum"})
})

function AddProduct({categories, isOpen, openChange}:Props) {
    const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                name: "",
                category: "",
                status: true,
                description: "",
            }
        });
    
    const actions = new ProductQuery();
    const queryClient = useQueryClient();
     const onSubmit = (values:z.infer<typeof formSchema>)=>{
            //console.log(values);
            productAdd.mutate(values);
        }
    const productAdd = useMutation({
        mutationFn: (values:z.infer<typeof formSchema>) => actions.create({
          name: values.name,
          status: values.status,
          categoryId: Number(values.category),
          weight: 0,
          description: values.description,
        }),
        onSuccess: ()=> {
            console.log("Produit ajouté avec succès");
            queryClient.invalidateQueries({queryKey: ["products"], refetchType: "active"});
            queryClient.invalidateQueries({queryKey: ["categories"], refetchType: "active"});
            openChange(false);
        },
    });
        {/**Clean up the form */}
        React.useEffect(()=>{
            if(isOpen){
                form.reset();
            }
        }, [isOpen]);

  return <Dialog open={isOpen} onOpenChange={openChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {"Ajouter un produit"}
            </DialogTitle>
            <DialogDescription>
              {"Complétez le formulaire pour ajouter un produit"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{"Informations générales"}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                    <FormField control={form.control} name="name" render={({field})=>(
                        <FormItem>
                            <FormLabel>{"Nom du Produit"}</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder='Entrer le nom du produit' />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )} />
                <FormField control={form.control} name="category" render={({field})=>(
                    <FormItem>
                        <FormLabel>{"Catégorie"}</FormLabel>
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
                    <FormLabel>{"Description"}</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Description du produit"/>
                    </FormControl>
                  </FormItem>
                )} />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{"Statut"}</h3>
              <FormField control={form.control} name="status" render={({field})=> (
                <FormItem>
                    <FormLabel>{"Statut du Produit"}</FormLabel>
                    <div className='flex gap-2 items-center'>
                        <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange}/>
                        </FormControl>
                        <span className='text-sm text-muted-foreground'>
                            {field.value ? "Actif" : "Désactivé"}
                        </span>
                    </div>
                    <FormMessage/>
                </FormItem>
              )}/>
            </div>

            <div className="flex gap-2">
              <Button type='submit' disabled={productAdd.isPending}>
                {productAdd.isPending && <Loader className='animate-spin' size={16}/>}
                {"Ajouter"}
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
      </Dialog>;
}

export default AddProduct;
