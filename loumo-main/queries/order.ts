import api from "@/providers/axios";
import { Order, OrderItem } from "@/types/types";

export default class OrderQuery {
  route = "/orders";
  create = async (
    data: Omit<Order, "id" | "orderItems"> & {
      orderItems?: Omit<OrderItem, "id" | "orderId">[];
    }
  ): Promise<Order> => {
    return api.post(`${this.route}`, data).then((response) => response.data);
  };

  getAll = async (): Promise<Order[]> => {
    return api.get(`${this.route}/`).then((response) => {
      return response.data;
    });
  };

  getOne = async (id: number): Promise<Order> => {
    return api.get(`${this.route}/${id}`).then((response) => response.data);
  };

  update = async (
    id: number,
    data: Partial<Order> & { addressId?: number }
  ): Promise<Order> => {
    return api
      .put(`${this.route}/${id}`, data)
      .then((response) => response.data);
  };

  delete = async (id: number): Promise<Order> => {
    return api.delete(`${this.route}/${id}`).then((response) => response.data);
  };
  reject = async (id:number):Promise<Order> => {
    return api.get(`${this.route}/terminate/${id}`).then((response) => response.data);
  }
}
