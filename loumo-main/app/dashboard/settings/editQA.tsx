'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import FaqQuery from '@/queries/faq';
import { Faq, Topic } from '@/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type Props = {
   QA: Faq;
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  topics: Topic[];
};

const formSchema = z.object({
  question: z.string({message: "La question est requise"}).min(5, "Trop court").max(80, {message: "Le maximum est de 80 caractères"}),
  answer: z.string({message: "La réponse est requise"}).min(5, "Trop court").max(230, {message: "Le maximum est de 230 caractères"}),
  topicId: z.string()
})

function EditQA({ QA, isOpen, openChange, topics }: Props) {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            question: QA.question,
            answer: QA.answer,
            topicId: String(QA.topicId),
        }
    });

    const queryClient = useQueryClient();
    const actions = new FaqQuery();
    const modifyQA = useMutation({
        mutationFn: (values:z.infer<typeof formSchema>)=> actions.update(QA.id, {
            topicId: Number(values.topicId),
            question: values.question,
            answer: values.answer
        }),
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ["topics"], refetchType: "active"});
            openChange(false);
        }
    });

    const onSubmit = (values:z.infer<typeof formSchema>) =>{
        modifyQA.mutate(values);
    };

    React.useEffect(() => {
        if (isOpen) {
          form.reset({
            question: QA.question,
            answer: QA.answer,
            topicId: String(QA.topicId),
          });
        }
      }, [isOpen, form, QA.answer, QA.question, QA.topicId]);

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{`Modifier ${QA.question}`}</DialogTitle>
                <DialogDescription>{"Complétez le formulaire pour modifier cette Question/Réponse ?"}</DialogDescription>
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
            <FormField
          control={form.control}
          name="topicId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{"Section parent"}</FormLabel>
              <FormControl>
                <Select defaultValue={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className='w-full'>
                        <SelectValue placeholder="Sélectionnez une section parante"/>
                    </SelectTrigger>
                    <SelectContent>
                        {topics.map(x=>
                            <SelectItem key={x.id} value={String(x.id)}>{x.name}</SelectItem>
                        )}
                    </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={modifyQA.isPending}>
                {modifyQA.isPending && (
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
            </div>
          </form>
        </Form>
        </DialogContent>
    </Dialog>
  )
}

export default EditQA