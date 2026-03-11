'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import RoleQuery from '@/queries/role'
import { Permission, Role } from '@/types/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface EditRoleDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  role: Role;
  permissions: Permission[];
}

const formSchema = z.object({
    name: z.string().min(3, {message: "Trop court"}),
    permissionsId: z.array(z.string().refine((val)=>!Number(val)))
})

export function EditRoleDialog({ open, setOpen, role, permissions }: EditRoleDialogProps) {

  const queryClient = useQueryClient()
  const roleQuery = new RoleQuery();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:{
        name: role.name,
        permissionsId: role?.permissions.flatMap(x=>String(x.id)) ?? [],
    }
  });

  const updateMutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      roleQuery.update(role.id, {
        name: values.name,
        permissionIds: values.permissionsId.map(x=> Number(x)),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'], refetchType: "active" });
      setOpen(false)
    },
  });

  const onSubmit = (values:z.infer<typeof formSchema>) =>{
    updateMutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{`Modifier le rôle ${role.name}`}</DialogTitle>
          <DialogDescription>
            {"Modifier le nom et les permissions du rôle sélectionné."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({field})=>(
                    <FormItem>
                        <FormLabel>{"Nom du rôle"}</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder='ex. Administrateur' />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )} />
                <FormField
              control={form.control}
              name="permissionsId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Permissions"}</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[250px] overflow-y-auto border p-3 rounded-md">
                      {permissions.map((perm) => {
                        const isChecked = field.value.includes(String(perm.id))
                        return (
                          <div key={perm.id} className="flex items-start space-x-2">
                            <Checkbox
                              id={`perm-${perm.id}`}
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, String(perm.id)])
                                } else {
                                  field.onChange(field.value.filter((id) => id !== String(perm.id)))
                                }
                              }}
                            />
                            <label htmlFor={`perm-${perm.id}`} className="text-sm">
                              {perm.action}
                            </label>
                          </div>
                        )
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className='mt-4'>
                <Button
                type="submit"
                disabled={updateMutation.isPending}
                >
                    {updateMutation.isPending && <Loader size={16} className='anmite-spin' />}
                {"Enregistrer"}
                </Button>
                <Button variant="outline" onClick={() => setOpen(false)}>
                {"Annuler"}
                </Button>
            </DialogFooter>
            </form>

        </Form>
      </DialogContent>
    </Dialog>
  )
}
