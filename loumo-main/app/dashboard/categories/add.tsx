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
import { formatName } from "@/lib/utils";
import CategoryQuery from "@/queries/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
};

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  name: z.string().min(2, { message: "Trop court" }),
  status: z.boolean(),
  display: z.boolean(),
  imgUrl: z
  .custom<File>()
  .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Format accepté: JPG, JPEG, PNG, WEBP uniquement",
  })
  .optional(),

});

function AddCategory({ isOpen, openChange }: Props) {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      status: true,
      display: false,
    },
  });

  const categoryQuery = new CategoryQuery();
  const queryClient = useQueryClient();
  const addCategory = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      categoryQuery.create({
        name: formatName(values.name),
        status: values.status,
        display: values.display,
        imgUrl: values.imgUrl,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      openChange(false);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addCategory.mutate(values);
  };

  React.useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen, form]);
  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{"Ajouter une catégorie"}</DialogTitle>
          <DialogDescription>
            {"Complétez le formulaire pour créer une catégorie"}
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
              name="status"
              render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <SwitchLabel {...field} description={"Activez ou désactivez la catégorie."}/>
                    </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="display"
              render={({ field:{name, ...props} }) => (
                <FormItem>
                    <FormControl>
                        <SwitchLabel name={`Headline ${name}`} {...props} description={"Activez pour afficher la catégorie sur la page d'Accueil du Site."}/>
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
              <Button type="submit" disabled={addCategory.isPending}>
                {addCategory.isPending && (
                  <Loader size={16} className="animate-spin" />
                )}
                {"Créer la catégorie"}
              </Button>
              <Button
                variant={"outline"}
                onClick={(e) => {
                  e.preventDefault();
                  form.reset();
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

export default AddCategory;
