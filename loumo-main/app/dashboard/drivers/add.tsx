"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
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
import { notifySuccess } from "@/lib/notify";
import { agentStatusName } from "@/lib/utils";
import AgentQuery from "@/queries/agent";
import UserQuery from "@/queries/user";
import { Agent, User, Zone } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader, MousePointer2, UserPlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  zones: Zone[];
  users: User[];
  agents: Agent[];
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
  zoneIds: number[];
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
  zoneIds: z.array(z.string()).refine((val)=> val.some(el => el), {message: "Il doit être affecté au moins à une zone"}), //inject here
  userId: z.string()
  .refine((val)=> !isNaN(Number(val)), {message: "Utilisateur invalide"})
  .optional()
});

function AddDriver({ isOpen, openChange, zones, users, agents }: Props) {
  const queryClient = useQueryClient();

  const [mode, setMode] = useState<boolean>(false);
  const [option, setOption] = useState<"create" | "select">();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      //password: "",
      tel: "",
      name: "",
      status: "AVAILABLE",
      zoneIds: [],
      userId: undefined
    },
  });

  const userQuery = new UserQuery();
  const agentQuery = new AgentQuery();

  const createAgent = useMutation({
    mutationFn: ({ status, zoneIds, userId }: AgentProps) =>
      agentQuery.create({
        status,
        zoneIds,
        userId,
      }),
      onSuccess: (agent)=>{
        queryClient.invalidateQueries({queryKey: ["agents"], refetchType: "active"});
        queryClient.invalidateQueries({queryKey: ["users"], refetchType: "active"});
        if(mode) openChange(false);
        form.reset({
      email: "",
      //password: "",
      tel: "",
      name: "",
      status: "AVAILABLE",
      zoneIds: [],
      userId: undefined
    });
    notifySuccess("Nouveau livreur ajouté !", agent.user && `Vous avez ajouté ${agent.user?.name} avec succès.`)
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
      const { status, zoneIds } = form.getValues();
      createAgent.mutate({
        userId: data.id,
        status,
        zoneIds: zoneIds.map(x=>Number(x)),
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createDriver.mutate(values);
  };

  useEffect(()=>{
    if(isOpen){
      form.reset({
      email: "",
      //password: "",
      tel: "",
      name: "",
      status: "AVAILABLE",
      zoneIds: [],
      userId: undefined
    })
    }
  },[isOpen, form])

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{"Ajouter un livreur"}</DialogTitle>
          <DialogDescription>
            {"Complétez le formulaire pour ajouter un livreur"}
          </DialogDescription>
        </DialogHeader>
        {
              !option ?
              <div className="grid grid-cols-1 gap-3 py-10">
                <span className="px-4 py-2 flex items-center gap-2 rounded-sm border border-gray-200 font-medium bg-white transition-colors cursor-pointer hover:bg-primary/10" onClick={()=>setOption("select")}><MousePointer2 size={16}/>{"Depuis un utilisateur existant"}</span>
                <span className="px-4 py-2 flex items-center gap-2 rounded-sm border border-gray-200 font-medium bg-white transition-colors cursor-pointer hover:bg-primary/10" onClick={()=>setOption("create")}><UserPlus size={16}/>{"Créer un utilisateur"}</span>
              </div> 
              :
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 ms:grid-cols-2 gap-6"
            >
              <Button variant={"default"} onClick={(e)=>{e.preventDefault();setOption(undefined)}} className="bg-gray-900 hover:bg-gray-700"><ArrowLeft size={16}/>{"Précédent"}</Button>
              {
                option === "select" &&
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{"Utilisateur"}</FormLabel>
                      <FormControl>
                        <Select defaultValue={field.value} onOpenChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sélectionner un utilisateur"/>
                          </SelectTrigger>
                          <SelectContent>
                            {users.filter(e=> !agents.some(x=>x.userId === e.id)).map(user=>
                              <SelectItem key={user.id} value={String(user.id)}>{user.name}</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              }
              {
                option === "create" &&
                <div className="grid grid-cols-1 gap-3">
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
                </div>
              }
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
                                  <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg"><circle r={5} cx={8} cy={8} fill={x==="AVAILABLE" ? "green" : x==="UNVERIFIED" ? "orange" : "red"}/></svg>
                                  {agentStatusName(x)}
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
                    name="zoneIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{"Zone desservie"}</FormLabel>
                        <FormControl>
                          <div className="mt-1 grid grid-cols-2 gap-2">
                              {zones.map((x, id) => (
                                <div key={id} className="inline-flex gap-1">
                                  <Checkbox key={id} checked={field.value.some(y=> y === String(x.id))}
                                  onCheckedChange={(checked)=> {
                                    return checked ?
                                    field.onChange([...field.value, String(x.id)])
                                    : field.onChange(field.value.filter((value)=> value !== String(x.id)))
                                  }} />
                                  <span className="text-sm font-medium">{x.name}</span>
                                </div>
                              ))}
                          </div>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
              <DialogFooter className="mt-4">
                <Button
                  type="submit"
                  variant={"ternary"}
                  onClick={()=>{setMode(false)}}
                  className="bg-black hover:bg-gray-800"
                  disabled={createDriver.isPending || createAgent.isPending}
                >
                  {createDriver.isPending ||
                    (createAgent.isPending && (
                      <Loader size={16} className="animate-spin" />
                    ))}
                  {"Enregistrer et continuer"}
                </Button>
                <Button
                  type="submit"
                  onClick={()=>{setMode(true)}}
                  disabled={createDriver.isPending || createAgent.isPending}
                >
                  {createDriver.isPending ||
                    (createAgent.isPending && (
                      <Loader size={16} className="animate-spin" />
                    ))}
                  {"Enregistrer"}
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
              </DialogFooter>
            </form>
          </Form>
              
            }
      </DialogContent>
    </Dialog>
  );
}

export default AddDriver;
