'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useStore } from "@/providers/datastore"
import UserQuery from "@/queries/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Loader } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"

const loginSchema = z.object({
  email:z.string().email({message: "Email non valide"}),
  password:z.string()
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const {login} = useStore();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const usersQuery = new UserQuery();
  const adminLogin = useMutation({
    mutationFn: (values:z.infer<typeof loginSchema>)=> usersQuery.loginAdmin({
      ...values
    }),
    onSuccess: ({user})=>{
      login(user);
    }
  });

  const onSubmit = (values:z.infer<typeof loginSchema>) => {
    adminLogin.mutate(values);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">{"Connexion"}</h1>
                </div>
                <FormField control={form.control} name="email" render={({field})=>(
                  <FormItem>
                    <FormLabel>{"Adresse mail"}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ex. krest@example.com"/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({field})=>(
                  <FormItem>
                    <FormLabel>{"Mot de Passe"}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} placeholder="*****"/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={adminLogin.isPending}>
                  {adminLogin.isPending && <Loader size={16} className="animate-spin"/>}
                  {"Se connecter"}
                </Button>
              </div>
            </form>
          </Form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/images/shop.webp"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
