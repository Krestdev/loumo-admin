import api from "@/providers/axios";
import { Address } from "@/types/types";
import { toast } from "react-toastify";

export default class AddressQuery {
  route = "/address";

  getAll = async (): Promise<Address[]> => {
    return api.get(`${this.route}`).then((response) => {
      return response.data;
    });
  };

  getOne = async (id: number): Promise<Address> => {
    return api.get(`${this.route}/${id}`).then((response) => response.data);
  };

  create = async (
    data: Omit<Address, "id" | "createdAt"> & { zoneId?: number }
  ): Promise<Address> => {
    return api.post(`${this.route}`, data).then((response) => response.data);
  };

  update = async (
    id: number,
    data: Partial<Omit<Address, "id">> & { zoneId?: number }
  ): Promise<Address> => {
    return api
      .put(`${this.route}/${id}`, data)
      .then((response) => response.data);
  };

  delete = async (id: number): Promise<Address> => {
    return api.delete(`/${this.route}/${id}`).then((response) => response.data);
  };
}
