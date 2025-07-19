"use client";
import PageLayout from "@/components/page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchAll } from "@/hooks/useData";
import { useStore } from "@/providers/datastore";
import PermissionQuery from "@/queries/permission";
import RoleQuery from "@/queries/role";
import UserQuery from "@/queries/user";
import { Permission, Role, User } from "@/types/types";
import {
  Edit,
  Key,
  Lock,
  MoreHorizontal,
  Search,
  Shield,
  Table,
  Trash,
  Users
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AddRoleDialog } from "./addRole";
import DeleteRole from "./deleteRole";
import { EditRoleDialog } from "./editRole";

function Page() {
  const rolesQuery = new RoleQuery();
  const getRoles = fetchAll(rolesQuery.getAll,"roles");

  const usersQuery = new UserQuery();
  const getUsers = fetchAll(usersQuery.getAll,"users");

  const permissionsQuery = new PermissionQuery();
  const getPermissions = fetchAll(permissionsQuery.getAll,"permissions");

  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const { setLoading } = useStore();

  const [search, setSearch] = useState("");
  const [addModal, setAddModal] = useState<boolean>(false);
  const [editDialog, setEditDialog] = useState<boolean>(false);
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const [selected, setSelected] = useState<Role>();

  useEffect(() => {
    setLoading(getRoles.isLoading || getUsers.isLoading);
    if (getRoles.isSuccess) setRoles(getRoles.data);
    if (getUsers.isSuccess) setUsers(getUsers.data);
    if (getPermissions.isSuccess) setPermissions(getPermissions.data);
  }, [
    setLoading,
    setRoles,
    getRoles.isLoading,
    getRoles.data,
    getRoles.isSuccess,
    setUsers,
    getUsers.isLoading,
    getUsers.data,
    getUsers.isSuccess,
    setPermissions,
    getPermissions.isLoading,
    getPermissions.data,
    getPermissions.isSuccess,
  ]);

  const filteredRoles = useMemo(() => {
    return roles.filter((r) =>
      r.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [roles, search]);

  const handleEdit = (role: Role) =>{
    setSelected(role);
    setEditDialog(true);
  }

  const handleDelete = (role: Role) =>{
    setSelected(role);
    setDeleteDialog(true);
  }

  return (
    <PageLayout
      isLoading={getRoles.isLoading || getUsers.isLoading}
      className="flex-1 overflow-auto p-4 space-y-6"
    >
      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Total rôles"}
            </CardTitle>
            <Shield className="text-muted-foreground" size={16} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Utilisateurs assignés"}
            </CardTitle>
            <Users className="text-muted-foreground" size={16} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(x=>!!x.role).length}
              {/* {roles.reduce((sum, role) => sum + (role.user?.length || 0), 0)} */}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Nombre de permissions"}
            </CardTitle>
            <Key className="text-muted-foreground" size={16} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {roles.reduce((sum, r) => sum + (r.permissions?.length || 0), 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {"Rôles actifs"}
            </CardTitle>
            <Lock className="text-green-500" size={16} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {roles.filter((r) => (r.user?.length ?? 0) > 0).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recherche */}
      <Card>
        <CardHeader>
          <CardTitle>
            {"Filtres & actions"}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 grid-cols-1 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={"Rechercher un rôle..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Button onClick={()=>setAddModal(true)}>{"Ajouter un rôle"}</Button>
        </CardContent>
      </Card>

      {/* Tableau des rôles */}
      <Card>
        <CardHeader>
          <CardTitle>{`Liste des rôles (${filteredRoles.length})`}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{"Nom"}</TableHead>
                <TableHead>{"Permissions"}</TableHead>
                <TableHead>{"Utilisateurs"}</TableHead>
                <TableHead>{"Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-gray-500 py-5 sm:text-lg xl:text-xl"
                  >
                    {"Aucun rôle trouvé"}
                    <img
                      src={"/images/search.png"}
                      alt="no-image"
                      className="w-1/3 max-w-32 h-auto mx-auto mt-5 opacity-20"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                filteredRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions?.slice(0, 3).map((p) => (
                          <Badge
                            key={p.id}
                            variant="outline"
                            className="text-xs"
                          >
                            {p.action}
                          </Badge>
                        ))}
                        {role.permissions?.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{role.permissions.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span>{role.user?.length || 0}</span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant={"ghost"}>
                            <MoreHorizontal size={16}/>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={()=>handleEdit(role)}>
                            <Edit size={16} />
                            {"Modifier"}
                          </DropdownMenuItem>
                          <DropdownMenuItem variant="destructive" onClick={()=>handleDelete(role)}>
                            <Trash size={16} />
                            {"Supprimer"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AddRoleDialog permissions={permissions} open={addModal} setOpen={setAddModal}/>
      {selected && <EditRoleDialog role={selected} permissions={permissions} open={editDialog} setOpen={setEditDialog} />}
      {selected && <DeleteRole role={selected} isOpen={deleteDialog} openChange={setDeleteDialog} />}
    </PageLayout>
  );
}

export default Page;
