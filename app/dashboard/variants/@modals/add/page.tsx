'use client'
import ModalLayout from "@/components/modal-layout";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem,SelectTrigger, SelectValue  } from "@/components/ui/select";
import ProductQuery from "@/queries/product";
import ProductVariantQuery from "@/queries/productVariant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
    name: z.string({message: "Veuillez renseigner un nom"}),
    weight: z.string({message: "Veuillez renseigner le poids"}),
    status: z.boolean(),
    price: z.string({message: "Veuillez renseigner un prix"}),
    productId: z.string({message: "Veuillez sélectionner le produit parent"}),
    imgUrl: z.string().optional()
})


function PageAdd() {

    const router = useRouter();
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            weight: "",
            status: true,
            price: "",
            productId: "",
        }
    })

    const actions = new ProductVariantQuery();
    const productQuery = new ProductQuery();
    const addVariant = useMutation({
        mutationFn: (values:z.infer<typeof formSchema>) => actions.create({
            productId: Number(values.productId),
            name: values.name,
            weight: Number(values.weight),
            status: values.status,
            price: Number(values.price),
            stock: {
                id: 0,
                quantity: 0,
                productVariantId: 0,
                productVariant: undefined,
                shopId: 0,
                shop: undefined,
                promotionId: null,
                promotion: undefined
            }
        }),
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ["variants"], refetchType: "active"},);
            router.push("/dashboard/variants");
        }
    });
    const products = useQuery({
        queryKey: ["products"],
        queryFn: ()=> productQuery.getAll(),
        refetchOnWindowFocus: false
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        addVariant.mutate(values);
    }

  return (
    <ModalLayout
      title="Ajouter une variante"
      description="Complétez le formulaire pour ajouter une variante"
      isLoading={false}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <FormField control={form.control} name="name" render={({field})=>(
                    <FormItem>
                        <FormLabel>{"Nom de la variante"}</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="Entrez un nom"/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )} />
                <FormField control={form.control} name="price" render={({field})=>(
                    <FormItem>
                        <FormLabel>{"Prix"}</FormLabel>
                        <div className="relative">
                            <FormControl>
                                <Input {...field} placeholder="Prix" className="pr-12"/>
                            </FormControl>
                            <span className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 text-sm">{"FCFA"}</span>
                        </div>
                        <FormMessage/>
                    </FormItem>
                )} />
                <FormField control={form.control} name="weight" render={({field})=>(
                    <FormItem>
                        <FormLabel>{"Poids de la variante"}</FormLabel>
                        <div className="relative">
                            <FormControl>
                                <Input {...field} placeholder="Poids en kg" className="pr-10"/>
                            </FormControl>
                            <span className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 text-sm">{"kg"}</span>
                        </div>
                        <FormMessage/>
                    </FormItem>
                )} />
                <FormField control={form.control} name="productId" render={({field})=>(
                    <FormItem>
                        <FormLabel>{"Produit parent"}</FormLabel>
                        <FormControl>
                            <Select defaultValue={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un produit"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {products.isSuccess && products.data.map((x)=>
                                    <SelectItem key={x.id} value={String(x.id)}>{x.name}</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )} />
            </div>
        </form>
      </Form>
    </ModalLayout>
  );
}

export default PageAdd;
