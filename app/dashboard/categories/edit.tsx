"use client";
import { FileUploader } from "@/components/fileUpload";
import SwitchLabel from "@/components/switchLabel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatName } from "@/lib/utils";
import CategoryQuery from "@/queries/category";
import { Category } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  category: Category;
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  categories: Category[];
};

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  name: z.string().min(2, { message: "Trop court" }),
  status: z.boolean(),
  display: z.boolean(),
  imgUrl: z
    .union([z.string(), z.instanceof(File)])
    .refine((file) => file instanceof File || typeof file === "string", {
      message: "Veuillez sélectionner un fichier valide",
    })
    .refine(
      (file) =>
        !file ||
        typeof file === "string" ||
        ACCEPTED_IMAGE_TYPES.includes(file.type),
      {
        message: "Format accepté: JPG, JPEG, PNG, WEBP uniquement",
      }
    )
    .optional(),
    parentId: z.string().optional(),
});

function EditCategory({ category, isOpen, openChange, categories }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: formatName(category.name),
      status: category.status,
      display: category.display,
      imgUrl: category.imgUrl,
      parentId: String(category.parentId) ?? undefined
    },
  });

  const categoryQuery = new CategoryQuery();
  const queryClient = useQueryClient();
  const editCategory = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      categoryQuery.update(category.id, {
        name: values.name,
        status: values.status,
        display: values.display,
        imgUrl: values.imgUrl,
        parentId: values.parentId === "false" ? null : Number(values.parentId)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      openChange(false);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    editCategory.mutate(values);
  };

  React.useEffect(() => {
    if (isOpen && category) {
      form.reset({
      name: formatName(category.name),
      status: category.status,
      display: category.display,
      imgUrl: category.imgUrl,
      parentId: String(category.parentId) ?? undefined
    });
    }
  }, [category, isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{`Modifier ${category.name}`}</DialogTitle>
          <DialogDescription>
            {"Modifier les informations de la catégorie"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Nom de la catégorie"}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nom" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Catégorie Parent"}</FormLabel>
                  <FormControl>
                    <Select defaultValue={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">{"Aucune"}</SelectItem>
                        {categories.map(category=>
                          <SelectItem key={category.id} value={String(category.id)}>{category.name}</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SwitchLabel
                      {...field}
                      description={"Activez ou désactivez la catégorie."}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="display"
              render={({ field: { name, ...props } }) => (
                <FormItem>
                  <FormControl>
                    <SwitchLabel
                      name="Headline"
                      {...props}
                      description={
                        !!name &&
                        "Activez pour afficher la catégorie sur la page d'Accueil du Site."
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imgUrl"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>{"Image de la Catégorie"}</FormLabel>
                  <FormControl>
                    <FileUploader onChange={onChange} value={value} {...rest} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button type="submit" disabled={editCategory.isPending}>
                {editCategory.isPending && (
                  <Loader size={16} className="animate-spin" />
                )}
                {"Modifier"}
              </Button>
              <Button
                variant={"outline"}
                onClick={(e) => {
                  e.preventDefault();
                  openChange(false);
                }}
              >
                {"Annuler"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditCategory;
