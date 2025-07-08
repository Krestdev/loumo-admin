import api from "@/providers/axios";
import { Promotion } from "@/types/types";

export default class PromotionQuery {
  route = "/promotions";
  create = async (
    data: Omit<Promotion, "id"> & { stockIds?: number[] }
  ): Promise<Promotion> => {
    return api.post(`${this.route}`, data).then((response) => response.data);
  };

  getAll = async (): Promise<Promotion[]> => {
    return api.get(`${this.route}/`).then((response) => {
      return response.data;
    });
  };

  getOne = async (id: number): Promise<Promotion> => {
    return api.get(`${this.route}/${id}`).then((response) => response.data);
  };

  update = async (
    id: number,
    data: Partial<Omit<Promotion, "id">> & { stockIds: number[] }
  ): Promise<Promotion> => {
    return api
      .put(`${this.route}/${id}`, data)
      .then((response) => response.data);
  };

  delete = async (id: number): Promise<Promotion> => {
    return api.delete(`${this.route}/${id}`).then((response) => response.data);
  };
}
