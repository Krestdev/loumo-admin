import api from "@/providers/axios";
import { Stock } from "@/types/types";

export default class StockQuery {
  route = "/stocks";
  create = async (
    data: Omit<Stock, "id" | "promotionId">
  ): Promise<Stock> => {
    return api.post(`${this.route}`, data).then((response) => response.data);
  };

  getAll = async (): Promise<Stock[]> => {
    return api.get(`${this.route}/`).then((response) => {
      return response.data;
    });
  };

  getOne = async (id: number): Promise<Stock> => {
    return api.get(`${this.route}/${id}`).then((response) => response.data);
  };

  update = async (
    id: number,
    data: Partial<Omit<Stock, "id" | "productVariantId">> & {
      promotionId?: number;
    }
  ): Promise<Stock> => {
    return api
      .put(`${this.route}/${id}`, data)
      .then((response) => response.data);
  };

  delete = async (id: number): Promise<Stock> => {
    return api.delete(`${this.route}/${id}`).then((response) => response.data);
  };
  restock = async (id: number, data:{quantity:number}): Promise<Stock> => {
    return api.put(`${this.route}/restock/${id}`, data).then((response)=>response.data)
  }
}
