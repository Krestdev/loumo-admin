"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Skeleton } from "@/components/ui/skeleton";
import { agentStatusName } from "@/lib/utils";
import AgentQuery from "@/queries/agent";
import UserQuery from "@/queries/user";
import ZoneQuery from "@/queries/zone";
import { Agent, Zone } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

type Props = {
  agent: Agent;
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
  zoneIds: number[];
};

const formSchema = z.object({
  email: z.string().email({ message: "Doit être une adresse mail" }),
  tel: z.string().regex(/^\d{9}$/, {
    message: "Le numéro doit contenir exactement 9 chiffres",
  }),
  name: z.string().min(3, { message: "Trop court" }),
  imageUrl: z.string().optional(),
  status: z.enum(agentStatus),
  zoneIds: z
    .array(z.string())
    .refine((val) => val, { message: "Ne peut pas être vide" }), //inject here
});

function EditDriver({ agent, isOpen, openChange }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: agent.user?.email ?? "",
      tel: agent.user?.tel ?? "",
      name: agent.user?.name ?? "",
      status: agent.status,
      zoneIds: agent.zone.map((e) => String(e.id)),
    },
  });

  const driverSuccess = React.useRef(false);
  const agentSuccess = React.useRef(false);

  const userQuery = new UserQuery();
  const agentQuery = new AgentQuery();
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
  }, [setZones, getZones.isSuccess, getZones.data]);

  const editAgent = useMutation({
    mutationFn: ({ status, zoneIds }: AgentProps) =>
      agentQuery.update(agent.id, {
        status,
        zoneIds,
      }),
    onSuccess: () => {
      agentSuccess.current = true;
      if (driverSuccess.current) {
        queryClient.invalidateQueries({
          queryKey: ["agents"],
          refetchType: "active",
        });
        openChange(false);
        form.reset();
      }
    },
  });

  const editDriver = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return userQuery.update(agent.userId, {
        email: values.email,
        name: values.name,
        tel: values.tel,
      });
    },
    onSuccess: () => {
      driverSuccess.current = true;
      if (agentSuccess.current) {
        queryClient.invalidateQueries({
          queryKey: ["agents"],
          refetchType: "active",
        });
        openChange(false);
        form.reset();
      }
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    driverSuccess.current = false;
    agentSuccess.current = false;
    editDriver.mutate(values);
    editAgent.mutate({
      status: values.status,
      zoneIds: values.zoneIds.map((e) => Number(e)),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Modifier ${agent.user?.name}`}</DialogTitle>
          <DialogDescription>
            {"Modifier les informations du Livreur"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Nom"}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nom du livreur" />
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
                    <Input {...field} placeholder="Email" />
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
                    <Input {...field} placeholder="ex. 699442512" />
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
            {getZones.isLoading ? (
              <Skeleton className="h-12 w-full" />
            ) : (
              getZones.isSuccess && (
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
                              <Checkbox
                                key={id}
                                checked={field.value.some(
                                  (y) => y === String(x.id)
                                )}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        String(x.id),
                                      ])
                                    : field.onChange(
                                        field.value.filter(
                                          (value) => value !== String(x.id)
                                        )
                                      );
                                }}
                              />
                              <span className="text-sm font-medium">
                                {x.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="submit"
                disabled={editAgent.isPending || editDriver.isPending}
              >
                {(editAgent.isPending || editDriver.isPending) && (
                  <Loader className="animate-spin" size={16} />
                )}
                {"Modifier"}
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

export default EditDriver;
