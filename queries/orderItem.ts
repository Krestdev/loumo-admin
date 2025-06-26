import api from "@/providers/axios";
import { OrderItem } from "@/types/types";
import { toast } from "react-toastify";

export default class OrderItemQuery {
  route = "/orderItems";
  create = async (
    data: Omit<OrderItem, "id"> & { orderId: number; deliveryId: number }
  ): Promise<OrderItem> => {
    return api.post(`/${this.route}`, data).then((response) => {
      toast.success(`Welcome back ${response.data.orderItem.name}`);
      return response.data;
    });
  };

  getAll = async (): Promise<OrderItem[]> => {
    return api.get(`${this.route}`).then((response) => {
      return response.data;
    });
  };

  getOne = async (id: number): Promise<OrderItem> => {
    return api.get(`${this.route}/${id}`).then((response) => response.data);
  };

  update = async (
    id: number,
    data: Partial<Omit<OrderItem, "id" | "orderId">> & { deliveryId?: number }
  ): Promise<OrderItem> => {
    return api
      .put(`${this.route}/${id}`, data)
      .then((response) => response.data);
  };

  delete = async (id: number): Promise<OrderItem> => {
    return api.delete(`${this.route}/${id}`).then((response) => response.data);
  };
}
