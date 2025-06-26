import api from "@/providers/axios";
import { Shop } from "@/types/types";

export default class ShopQuery {
  route = "/shops";
  create = async (
    data: Omit<Shop, "id"> & { addressId: number }
  ): Promise<Shop> => {
    return api.post(`${this.route}`, data).then((response) => response.data);
  };

  getAll = async (): Promise<Shop[]> => {
    return api.get(`${this.route}/`).then((response) => {
      return response.data;
    });
  };

  getOne = async (id: number): Promise<Shop> => {
    return api.get(`${this.route}/${id}`).then((response) => response.data);
  };

  update = async (
    id: number,
    data: Partial<Omit<Shop, "id">> & { addressId?: number }
  ): Promise<Shop> => {
    return api
      .put(`${this.route}/${id}`, data)
      .then((response) => response.data);
  };

  delete = async (id: number): Promise<Shop> => {
    return api.delete(`${this.route}/${id}`).then((response) => response.data);
  };
}
