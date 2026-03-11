import api from "@/providers/axios";
import { Role } from "@/types/types";
import { toast } from "react-toastify";

export default class RoleQuery {
  route = "/roles";
  create = async (
    data: Omit<Role, "id"> & { permissionIds?: number[] }
  ): Promise<Role> => {
    return api.post(`${this.route}`, data).then((response) => {
      toast.success(`Welcome back ${response.data.role.name}`);
      return response.data;
    });
  };

  getAll = async (): Promise<Role[]> => {
    return api
      .get(`${this.route}/?roleD=true&roleD=true&logD=true&notifD=true`)
      .then((response) => {
        return response.data;
      });
  };

  getOne = async (id: number): Promise<Role> => {
    return api.get(`/${this.route}/${id}`).then((response) => response.data);
  };

  update = async (
    id: number,
    data: Partial<Omit<Role, "id">> & { permissionIds?: number[] }
  ): Promise<Role> => {
    return api
      .put(`${this.route}/${id}`, data)
      .then((response) => response.data);
  };

  delete = async (id: number): Promise<Role> => {
    return api.delete(`${this.route}/${id}`).then((response) => response.data);
  };
}
