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
import { Topic } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  topic: Topic;
};

const formSchema = z.object({
  name: z.string({message: "Veuillez renseigner un nom"}).min(3,{message: "Trop court"}).max(40, {message: "40 caractères maximum"}),
});

function EditTopic({ topic ,isOpen, openChange}: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: topic.name,
    },
  });


  const queryClient = useQueryClient();
  const topicQuery = new TopicQuery();
  const editTopic = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      topicQuery.update(topic.id, {
          ...values,
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
    editTopic.mutate(values);
  };

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        name: topic.name,
      });
    }
  }, [isOpen, form, topic.name]);

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Modifier la section : ${topic.name}`}</DialogTitle>
          <DialogDescription>
            {"Complétez le formulaire pour modifier la section"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{"Nom du Sujet"}</FormLabel>
              <FormControl>
                <Input {...field} placeholder="ex. Compte & support" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={editTopic.isPending}>
                {editTopic.isPending && (
                  <Loader size={16} className="animate-spin" />
                )}
                {"Modifier"}
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

export default EditTopic;
