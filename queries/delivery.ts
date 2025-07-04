import api from "@/providers/axios";
import { Delivery } from "@/types/types";

export default class DeliveryQuery {
  route = "/deliveries";
  create = async (
    data: {agentId: number; orderId: number}
  ): Promise<Delivery> => {
    return api.post(`${this.route}`, data).then((response) => response.data);
  };

  getAll = async (): Promise<Delivery[]> => {
    return api.get(`${this.route}/`).then((response) => {
      return response.data;
    });
  };

  getOne = async (id: number): Promise<Delivery> => {
    return api.get(`${this.route}/${id}`).then((response) => response.data);
  };

  update = async (
    id: number,
    data: Partial<Omit<Delivery, "id" | "deliveryId">> & { agentId?: number }
  ): Promise<Delivery> => {
    return api
      .put(`${this.route}/${id}`, data)
      .then((response) => response.data);
  };

  delete = async (id: number): Promise<Delivery> => {
    return api.delete(`${this.route}/${id}`).then((response) => response.data);
  };
}
