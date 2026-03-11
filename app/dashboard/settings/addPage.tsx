"use client";
import TiptapEditor from "@/components/tiptap-content";
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
import { Textarea } from "@/components/ui/textarea";
import SettingQuery from "@/queries/setting";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CirclePlus, Loader } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
};

const formSchema = z.object({
  name: z
    .string({ message: "Le titre est requis" })
    .min(3, "Trop court")
    .max(80, "Le maximum est de 80 caractères"),
  note: z
    .string({ message: "La meta description est requise" })
    .min(5, "Trop court")
    .max(160, "Le maximum est de 160 caractères"),
  content: z
    .string({ message: "Le contenu est requis" })
    .min(10, "Le contenu est trop court"),
});

function AddPage({ isOpen, openChange }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      note: "",
      content: "",
    },
  });

  const queryClient = useQueryClient();
  const settingQuery = new SettingQuery();

  const createPage = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      settingQuery.create({
        ...values,
        section: "page",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["settings"],
        refetchType: "active",
      });
      openChange(false);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createPage.mutate(values);
  };

  React.useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent className="sm:max-w-[70vw] xl:max-w-[1080px]">
        <DialogHeader>
          <DialogTitle>{"Créer une page"}</DialogTitle>
          <DialogDescription>{"Remplissez les informations de la page"}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Titre"}</FormLabel>
                  <FormControl>
                    <Input placeholder="ex. Politique de confidentialité" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Meta description"}</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Courte description pour les moteurs de recherche.." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Contenu"}</FormLabel>
                  <FormControl>
                    <TiptapEditor value={field.value} onValueChange={field.onChange}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <Button type="submit" disabled={createPage.isPending}>
                {createPage.isPending ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <CirclePlus size={16} />
                )}
                {"Ajouter"}
              </Button>
              <Button
                variant="outline"
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

export default AddPage;
