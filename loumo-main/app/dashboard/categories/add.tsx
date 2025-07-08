'use client'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import CategoryQuery from '@/queries/category';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type Props = {
    isOpen: boolean;
    openChange: React.Dispatch<React.SetStateAction<boolean>>;
}

const formSchema = z.object({
    name: z.string().min(2,{message: "Trop court"}),
    status: z.boolean(),
    imgUrl: z.string().optional()
})

function AddCategory({isOpen, openChange}:Props) {
    const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                name: "",
                status: true,
            }
        });

    const categoryQuery = new CategoryQuery();
    const queryClient = useQueryClient();
    const addCategory = useMutation({
        mutationFn: (values:z.infer<typeof formSchema>)=>categoryQuery.create({
            name: values.name,
            status: values.status,
        }),
        onSuccess: ()=> {
            queryClient.invalidateQueries({queryKey: ["categories"]});
            openChange(false);
        }
    });

    const onSubmit = (values: z.infer<typeof formSchema>) =>{
        addCategory.mutate(values);
    }

    React.useEffect(() => {
      if (isOpen) {
        form.reset();
      }
    }, [isOpen]);
  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>{"Ajouter une catégorie"}</DialogTitle>
                <DialogDescription>{"Complétez le formulaire pour créer une catégorie"}</DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                    <div className="grid gap-4">
                        <FormField control={form.control} name="name" render={({field})=>(
                            <FormItem>
                                <FormLabel>{"Nom de la catégorie"}</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder='Nom' />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="status" render={({field})=>(
                            <FormItem>
                    <FormLabel>{"Statut"}</FormLabel>
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
                        )} />
                    </div>
                    <div className='flex justify-end gap-2'>
                        <Button type="submit" disabled={addCategory.isPending}>
                            {addCategory.isPending && <Loader size={16} className='animate-spin'/>}
                            {"Créer la catégorie"}
                        </Button>
                        <Button variant={"outline"} onClick={(e)=>{e.preventDefault(); form.reset(); openChange(false)}}>{"Annuler"}</Button>
                    </div>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}

export default AddCategory