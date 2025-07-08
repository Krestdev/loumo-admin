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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AgentQuery from "@/queries/agent";
import UserQuery from "@/queries/user";
import ZoneQuery from "@/queries/zone";
import { User, Zone } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
};

const agentStatus = [
  "AVAILABLE",
  "SUSPENDED",
  "FULL",
  "UNAVAILABLE",
  "UNVERIFIED",
] as const;

type AgentProps = {
  status: (typeof agentStatus)[number];
  zoneId: number;
  userId: number;
};

const formSchema = z.object({
  email: z.string().email({ message: "Doit être une adresse mail" }),
  //password: z.string(),
  tel: z
    .string()
    .regex(/^\d{9}$/, {
      message: "Le numéro doit contenir exactement 9 chiffres",
    }),
  name: z.string().min(3, { message: "Trop court" }),
  imageUrl: z.string().optional(),
  // roleId: z.number(), Make sure its fixed
  //userId: z.number(), We get it from the first response
  status: z.enum(agentStatus),
  zoneId: z.string(), //inject here
});

function AddDriver({ isOpen, openChange }: Props) {
  const zoneQuery = new ZoneQuery();
  const queryClient = useQueryClient();

  const getZones = useQuery({
    queryKey: ["zones"],
    queryFn: () => zoneQuery.getAll(),
    refetchOnWindowFocus: false,
  });

  const [zones, setZones] = React.useState<Zone[]>([]);

  React.useEffect(() => {
    if (getZones.isSuccess) {
      setZones(getZones.data);
    }
  }, [setZones, getZones.data, getZones.isSuccess]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      //password: "",
      tel: "",
      name: "",
      status: "AVAILABLE",
      zoneId: "",
    },
  });

  const userQuery = new UserQuery();
  const agentQuery = new AgentQuery();

  const createAgent = useMutation({
    mutationFn: ({ status, zoneId, userId }: AgentProps) =>
      agentQuery.create({
        status,
        zoneId,
        userId,
      }),
      onSuccess: ()=>{
        queryClient.invalidateQueries({queryKey: ["agents"], refetchType: "active"});
        queryClient.invalidateQueries({queryKey: ["users"], refetchType: "active"});
        openChange(false);
        form.reset();
      }
  });

  const createDriver = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
        return userQuery.register({
          email: values.email,
          name: values.name,
          password: "Loumo123", //default password
          tel: values.tel,
        });
    },
    onSuccess: (data: User) => {
      const { status, zoneId } = form.getValues();
      createAgent.mutate({
        userId: data.id,
        status,
        zoneId: Number(zoneId),
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createDriver.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{"Ajouter un livreur"}</DialogTitle>
          <DialogDescription>
            {"Complétez le formulaire pour ajouter un livreur"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 ms:grid-cols-2 gap-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Nom du Livreur"}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nom" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Adresse mail"}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ex. livreur@gmail.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Numéro de téléphone"}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ex. 695552211" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Statut"}</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {agentStatus.map((x, id) => (
                          <SelectItem key={id} value={x}>
                            {x}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zoneId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Zone desservie"}</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={"Sélectionner une zone"} />
                      </SelectTrigger>
                      <SelectContent>
                        {zones.map((x) => (
                          <SelectItem key={x.id} value={String(x.id)}>
                            {x.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="submit"
                disabled={createDriver.isPending || createAgent.isPending}
              >
                {createDriver.isPending ||
                  (createAgent.isPending && (
                    <Loader size={16} className="animate-spin" />
                  ))}{" "}
                {"Créer un Livreur"}
              </Button>
              <Button
                variant={"outline"}
                onClick={(e) => {
                  e.preventDefault();
                  openChange(false);
                  form.reset();
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

export default AddDriver;
