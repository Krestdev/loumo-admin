import api from "@/providers/axios";
import { Address, Zone } from "@/types/types";

export default class ZoneQuery {
  route = "/zones";
  create = async (
    data: Omit<Zone, "id" | "addresses"> & { addresses: Partial<Address>[] }
  ): Promise<Zone> => {
    return api.post(`${this.route}`, data).then((response) => response.data);
  };

  getAll = async (): Promise<Zone[]> => {
    return api.get(`${this.route}/`).then((response) => {
      return response.data;
    });
  };

  getOne = async (id: number): Promise<Zone> => {
    return api.get(`${this.route}/${id}`).then((response) => response.data);
  };

  update = async (
    id: number,
    data: Partial<Omit<Zone, "id">> & { addressIds: number[] }
  ): Promise<Zone> => {
    return api
      .put(`${this.route}/${id}`, data)
      .then((response) => response.data);
  };

  delete = async (id: number): Promise<Zone> => {
    return api.delete(`${this.route}/${id}`).then((response) => response.data);
  };
}
