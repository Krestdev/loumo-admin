import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import ProductQuery from '@/queries/product';
import { Category } from '@/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { useForm } from 'react-hook-form';
import z from 'zod';


type Props = {
    ids: number[];
    isOpen: boolean;
    openChange: React.Dispatch<React.SetStateAction<boolean>>;
    categories: Category[];
}

const formSchema = z.object({
    category: z.string({message: "Veuillez sélectionner une catégorie"}),
    status: z.boolean()
})

function GroupEdit({ ids, isOpen, openChange, categories }: Props) {

    const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                category: "",
                status: true
            }
        });
    const actions = new ProductQuery();
    const queryClient = useQueryClient();
    const groupEdit = useMutation({
        mutationFn: (values:z.infer<typeof formSchema>) => actions.bulckUpdate(ids,{
            categoryId: values.category ? Number(values.category) : undefined,
            status: values.status
        }, {product: ids.map(id => ({id}))}),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["products"], refetchType: "active"});
            queryClient.invalidateQueries({queryKey: ["categories"], refetchType: "active"});
            openChange(false);
        }
    })
    const onSubmit = (values:z.infer<typeof formSchema>)=>{
            //console.log(values);
            groupEdit.mutate(values);
        }

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{"Édition groupée"}</DialogTitle>
                    <DialogDescription>
                      {"Modifiez plusieurs produits en même temps"}
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="category" render={({field})=>(
                            <FormItem>
                                <FormLabel>{"Catégorie"}</FormLabel>
                                <FormControl>
                                    <Select defaultValue={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Changer la catégorie" />
                                        </SelectTrigger>
                                        <SelectContent>
                                        {categories.map((cat, id) => (
                                            <SelectItem key={cat.id} value={cat.name}>
                                            {cat.name}
                                            </SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>

                        )} />
                        <FormField control={form.control} name="status" render={({field})=>(
                            <FormItem>
                                <FormLabel>{"Statut"}</FormLabel>
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange}/>
                                </FormControl>
                            </FormItem>
                        )}/>
                        <div className="flex justify-end gap-2">
                        <Button type='submit'>
                            {"Appliquer les modifications"}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={(e) => {e.preventDefault(); openChange(false)}}
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

export default GroupEdit