"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import TopicQuery from "@/queries/topic";
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
  name: z.string({message: "Veuillez renseigner un nom"}).min(3,{message: "Trop court"}).max(40, {message: "40 caractères maximum"}),
});

function AddTopic({ isOpen, openChange}: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });


  const queryClient = useQueryClient();
  const topicQuery = new TopicQuery();
  const createTopic = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      topicQuery.create({
          ...values
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["topics"],
        refetchType: "active",
      });
      openChange(false);
    },
  });


  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createTopic.mutate(values);
  };

  React.useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{"Créer une section de Question-Réponse"}</DialogTitle>
          <DialogDescription>
            {"Complétez le formulaire pour ajouter une section"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{"Nom de la Section"}</FormLabel>
              <FormControl>
                <Input {...field} placeholder="ex. Compte & support" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={createTopic.isPending}>
                {createTopic.isPending ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <CirclePlus size={16} />
                )}{" "}
                {"Ajouter"}
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
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddTopic;
