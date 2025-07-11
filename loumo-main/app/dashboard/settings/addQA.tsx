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
import { Textarea } from "@/components/ui/textarea";
import FaqQuery from "@/queries/faq";
import { Topic } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CirclePlus, Loader } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  topic: Topic;
};

const formSchema = z.object({
  question: z.string({message: "La question est requise"}).min(5, "Trop court").max(80, {message: "Le maximum est de 80 caractères"}),
  answer: z.string({message: "La réponse est requise"}).min(5, "Trop court").max(230, {message: "Le maximum est de 230 caractères"}),
});

function AddQA({ isOpen, openChange, topic }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      answer: "",
    },
  });


  const queryClient = useQueryClient();
  const faqQuery = new FaqQuery();
  const createQA= useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      faqQuery.create({
          ...values,
          topicId: topic.id
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
    createQA.mutate(values);
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
          <DialogTitle>{"Créer une Question-Réponse"}</DialogTitle>
          <DialogDescription>
            {`Ajouter une QA dans ${topic.name}`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{"Question"}</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="ex. Puis-je commander sans créer de compte ?" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
            <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{"Réponse"}</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="ex. Non, il n'est pas possible de soumettre une commande sans avoir de compte au préalable" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={createQA.isPending}>
                {createQA.isPending ? (
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

export default AddQA;
