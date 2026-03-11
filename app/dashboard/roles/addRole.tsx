'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Permission } from '@/types/types'
import RoleQuery from '@/queries/role'

interface AddRoleDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  permissions: Permission[];
}

export function AddRoleDialog({ open, setOpen, permissions }: AddRoleDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])

  const queryClient = useQueryClient()
  const roleQuery = new RoleQuery()

  const handleTogglePermission = (id: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const createMutation = useMutation({
    mutationFn: () =>
      roleQuery.create({
        name,
        //description,
        //isActive,
        permissions: [],
        permissionIds: selectedPermissions,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      setOpen(false)
      resetForm()
    },
  })

  const resetForm = () => {
    setName('')
    setDescription('')
    setIsActive(true)
    setSelectedPermissions([])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{"Ajouter un rôle"}</DialogTitle>
          <DialogDescription>{"Créer un nouveau rôle avec ses permissions"}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">{"Nom du rôle"}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Gestionnaire de stock"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="isActive">{"Statut"}</Label>
              <div className="flex items-center space-x-2">
                <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
                <span>{isActive ? 'Actif' : 'Inactif'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{"Description"}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez les responsabilités de ce rôle..."
            />
          </div>

          <div className="space-y-2">
            <Label>Permissions</Label>
            <div className="grid gap-3 md:grid-cols-2 max-h-[250px] overflow-y-auto pr-2">
              {permissions.map((permission) => (
                <div
                  key={permission.id}
                  className="flex items-start space-x-2 border p-2 rounded-md"
                >
                  <Checkbox
                    id={`perm-${permission.id}`}
                    checked={selectedPermissions.includes(permission.id)}
                    onCheckedChange={() => handleTogglePermission(permission.id)}
                  />
                  <div className="space-y-1 text-sm">
                    <Label htmlFor={`perm-${permission.id}`} className="font-medium">
                      {permission.action}
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className='mt-4'>
            <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
              {"Créer"}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {"Annuler"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
