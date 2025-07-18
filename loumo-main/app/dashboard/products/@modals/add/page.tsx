"use client";

import ModalLayout from "@/components/modal-layout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import CategoryQuery from "@/queries/category";
import ProductQuery from "@/queries/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  name: z.string().min(3,{ message: "Veuillez entrer un nom" }),
  category: z.string({ message: "Veuillez sélectionner une catégorie" }),
  description: z.string().min(10,{message: "Veuillez renseigner une description"}),
  status: z.boolean(),
});

export default function AddProductModal() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      status: true,
      description: ""
    },
  });

  const actions = new ProductQuery();
  const categoriesQuery = new CategoryQuery();
  const queryClient = useQueryClient();

  {
    /**Fetch all categories */
  }
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesQuery.getAll(),
  });

  {
    /**Form submit */
  }
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    //console.log(values);
    productAdd.mutate(values);
  };
  {
    /**Add product post */
  }
  const productAdd = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      actions.create({
        name: values.name,
        status: values.status,
        categoryId: Number(values.category),
        weight: 0,
        description: values.description,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: ["categories"],
        refetchType: "active",
      });
      router.back();
    },
  });

  return (
    <ModalLayout isLoading={isLoading} title="Ajouter un Produit" description="Complétez le formulaire pour ajouter un produit">
      {/* Formulaire */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{"Informations générales"}</h3>
            <div className="grid gap-4 md:grid-cols-2 place-items-start">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{"Nom du Produit"}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Entrer le nom du produit"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{"Catégorie"}</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {data?.map((cat) => (
                            <SelectItem key={cat.id} value={String(cat.id)}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{"Description"}</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Décrivez le produit..."/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>

          {/* Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{"Statut"}</h3>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Statut du Produit"}</FormLabel>
                  <div className="flex gap-2 items-center">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <span className="text-sm text-muted-foreground">
                      {field.value ? "Actif" : "Désactivé"}
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={productAdd.isPending}>
              {productAdd.isPending && (
                <Loader className="animate-spin" size={16} />
              )}
              {"Ajouter"}
            </Button>
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                form.reset();
                router.back();
              }}
            >
              {"Annuler"}
            </Button>
          </div>
        </form>
      </Form>
    </ModalLayout>
  );
}
