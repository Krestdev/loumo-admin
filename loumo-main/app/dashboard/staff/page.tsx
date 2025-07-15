'use client'
import PageLayout from '@/components/page-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useStore } from '@/providers/datastore';
import PermissionQuery from '@/queries/permission';
import RoleQuery from '@/queries/role';
import UserQuery from '@/queries/user';
import { Permission, Role, User } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import { formatRelative } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Search, Shield, UserCheck, Users, UserX } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

function Page() {

  const permissionsQuery = new PermissionQuery();
  const getPermissions = useQuery({
    queryKey: ["permissions"],
    queryFn: () => permissionsQuery.getAll(),
    refetchOnWindowFocus: false,
  });

  const rolesQuery = new RoleQuery();
    const getRoles = useQuery({
      queryKey: ["roles"],
      queryFn: () => rolesQuery.getAll(),
      refetchOnWindowFocus: false,
    });

    const usersQuery = new UserQuery();
      const getUsers = useQuery({
        queryKey: ["users"],
        queryFn: () => usersQuery.getAll(),
        refetchOnWindowFocus: false,
      });

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [staff, setStaff] = useState<User[]>([]);
  const { setLoading } = useStore();

  const [searchTerm, setSearchTerm] = useState<string>("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
      setLoading(getRoles.isLoading || getUsers.isLoading);
      if (getRoles.isSuccess) setRoles(getRoles.data);
      if (getUsers.isSuccess) setStaff(getUsers.data);
      if (getPermissions.isSuccess) setPermissions(getPermissions.data);
    }, [
      setLoading,
      setRoles,
      getRoles.isLoading,
      getRoles.data,
      getRoles.isSuccess,
      setStaff,
      getUsers.isLoading,
      getUsers.data,
      getUsers.isSuccess,
      setPermissions,
      getPermissions.isLoading,
      getPermissions.data,
      getPermissions.isSuccess,
    ]);

    const filteredStaff = useMemo(()=>{
      return staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || member.roleId === Number(roleFilter)
    const matchesStatus = statusFilter === "all" || member.active === Boolean(statusFilter)
    return matchesSearch && matchesRole && matchesStatus
  })
    },[staff, searchTerm, roleFilter, statusFilter]);
  
  return (
    <PageLayout isLoading={getPermissions.isLoading || getRoles.isLoading || getUsers.isLoading} className='flex-1 space-y-6 p-4 overflow-auto'>
      {/* Staff Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{"Total utilisateurs"}</CardTitle>
              <Users className="text-muted-foreground" size={16} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staff.length}</div>
              <p className="text-xs text-muted-foreground">{`${staff.filter((s) => !!s.active ).length} actifs`}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{"Administrateurs"}</CardTitle>
              <Shield className="text-red-500" size={16} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staff.filter((s) => s.role && s.role.name.includes("admin")).length}</div>
              <p className="text-xs text-muted-foreground">{"Accès complet"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{"Connectés aujourd'hui"}</CardTitle>
              <UserCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{"4"}</div>
              <p className="text-xs text-muted-foreground">{"Dernières 24h"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{"Comptes inactifs"}</CardTitle>
              <UserX className=" text-orange-500" size={16} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staff.filter((s) => !s.active).length}</div>
              <p className="text-xs text-muted-foreground">{"À vérifier"}</p>
            </CardContent>
          </Card>
        </div>

        {/* Roles Overview */}
        <Card>
          <CardHeader>
            <CardTitle>{"Rôles et permissions"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {roles.map((role, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge>{role.name}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {`${staff.filter((s) => s.role?.name === role.name).length} membres`}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {(
                        role.permissions.map((perm) => (
                          <Badge key={perm.id} variant="outline">
                            {permissions.find((p) => p.id === perm.id)?.action ?? "Permission X"}
                          </Badge>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>{"Filtres"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"Tous les rôles"}</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.name} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"Tous"}</SelectItem>
                  <SelectItem value={String(true)}>{"Actif"}</SelectItem>
                  <SelectItem value={String(false)}>{"Inactif"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Staff Table */}
        <Card>
          <CardHeader>
            <CardTitle>{`Utilisateurs (${filteredStaff.length})`}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{"Membre"}</TableHead>
                  <TableHead>{"Rôle"}</TableHead>
                  <TableHead>{"Boutique/Zone"}</TableHead>
                  <TableHead>{"Statut"}</TableHead>
                  <TableHead>{"Dernière connexion"}</TableHead>
                  <TableHead>{"Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.imageUrl || "/images/placeholder.svg"} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge>{member.role?.name}</Badge>
                    </TableCell>
                    <TableCell>{member.addresses && member.addresses.length > 0 ? (member.addresses[0].local ?? "--") : "---"}</TableCell>
                    <TableCell>
                      <Badge variant={member.active ? "info" : "destructive"} >{member.active ? "Actif" : "Inactif"}</Badge>
                    </TableCell>
                    <TableCell>{formatRelative(new Date(member.updatedAt), new Date(), {locale: fr})}</TableCell>
                    <TableCell>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

    </PageLayout>
  )
}

export default Page