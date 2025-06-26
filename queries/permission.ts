import api from "@/providers/axios";
import { Permission } from "@/types/types";
import { toast } from "react-toastify";

export default class PermissionQuery {
  route = "/permissions";
  create = async (
    data: Omit<Permission, "id"> & { roleIds?: number[] }
  ): Promise<Permission> => {
    return api.post(`${this.route}`, data).then((response) => {
      toast.success(`Welcome back ${response.data.permission.name}`);
      return response.data;
    });
  };

  getAll = async (): Promise<Permission[]> => {
    return api.get(`${this.route}`).then((response) => {
      return response.data;
    });
  };

  getOne = async (id: number): Promise<Permission> => {
    return api.get(`/${this.route}/${id}`).then((response) => response.data);
  };

  update = async (
    id: number,
    data: Partial<Omit<Permission, "id">> & { roleIds?: number[] }
  ): Promise<Permission> => {
    return api
      .put(`${this.route}/${id}`, data)
      .then((response) => response.data);
  };

  delete = async (id: number): Promise<Permission> => {
    return api.delete(`${this.route}/${id}`).then((response) => response.data);
  };
}
