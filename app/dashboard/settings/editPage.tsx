"use client";

import { Setting } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Loader, Save } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(3, "Titre requis"),
  content: z.string().min(10, "Contenu trop court"),
  note: z.string().optional(),
});

type Props = {
  isOpen: boolean;
  openChange: (open: boolean) => void;
  page: Setting;
};

export default function EditPageModal({ isOpen, openChange, page }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: page.name || "",
      content: page.content || "",
      note: page.note || "",
    },
  });

  const queryClient = useQueryClient();
  const settingQuery = new SettingQuery();

  const updatePage = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      settingQuery.update(page.id, {
        ...values,
        section: page.section, // conservé
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      openChange(false);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updatePage.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent className="sm:max-w-[70vw] xl:max-w-[1080px]">
        <DialogHeader>
          <DialogTitle>{"Modifier la page"}</DialogTitle>
          <DialogDescription>
           {" Mettez à jour les informations de la page "}<strong>{page.name}</strong>
          </DialogDescription>
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
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Meta description (optionnel)"}</FormLabel>
                  <FormControl>
                    <Textarea rows={2} placeholder="Courte description pour le SEO..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <Button type="submit" disabled={updatePage.isPending}>
                {updatePage.isPending ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {"Enregistrer"}
              </Button>
              <Button variant="outline" onClick={() => openChange(false)}>
                {"Annuler"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
