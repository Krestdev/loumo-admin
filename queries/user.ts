import api from "@/providers/axios";
import { User } from "@/types/types";
import { toast } from "react-toastify";

export default class UserQuery {
  route = "/users";
  login = async (data: {
    email: string;
    password: string;
  }): Promise<{ user: User; token: string }> => {
    return api.post(`${this.route}/login`, data).then((response) => {
      toast.success(`Welcome back ${response.data.user.name}`);
      return response.data;
    });
  };
  getAll = async (): Promise<User[]> => {
    return api
      .get(`${this.route}/?roleD=true&addressD=true&logD=true&notifD=true`)
      .then((response) => {
        return response.data;
      });
  };
  getAllClients = async (): Promise<User[]> => {
    return api
      .get(`${this.route}/?roleD=true&addressD=true&logD=true&notifD=true&clients=true`)
      .then((response) => {
        return response.data;
      });
  };
  getOne = async (id: number): Promise<User> => {
    return api.get(`${this.route}/${id}`).then((response) => response.data);
  };
  addProductsToFavorite = async (
    id: number,
    productIds: number[]
  ): Promise<User> => {
    return api
      .patch(`${this.route}/${id}`, { productIds })
      .then((response) => response.data);
  };
  register = async (
    data: Partial<User> & {
      addressList?: number[];
    }
  ): Promise<User> => {
    return api.post(`${this.route}`, data).then((response) => response.data);
  };
  update = async (
    id: number,
    data: Partial<Omit<User, "id" | "createdAt">>
  ): Promise<User> => {
    return api.put(`${this.route}/${id}`, data).then((response) => response.data);
  };
  delete = async (id: number) => {
    return api.delete(`${this.route}/${id}`).then((response) => response);
  };
}
