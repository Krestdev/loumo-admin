import api from "@/providers/axios";
import { Payment } from "@/types/types";

export default class PaymentQuery {
  route = "/payments";
  create = async (
    data: Omit<Payment, "id"> & { orderId: number }
  ): Promise<Payment> => {
    return api.post(`${this.route}`, data).then((response) => response.data);
  };

  getAll = async (): Promise<Payment[]> => {
    return api.get(`${this.route}/`).then((response) => {
      return response.data;
    });
  };

  getOne = async (id: number): Promise<Payment> => {
    return api.get(`${this.route}/${id}`).then((response) => response.data);
  };

  update = async (
    id: number,
    data: Partial<Omit<Payment, "id">> & { orderId: number }
  ): Promise<Payment> => {
    return api
      .put(`${this.route}/${id}`, data)
      .then((response) => response.data);
  };

  delete = async (id: number): Promise<Payment> => {
    return api.delete(`${this.route}/${id}`).then((response) => response.data);
  };
  //Permet d'encaisser une commande en créant un paiement en cash associé à la commandes
  cash = async (data:{
    name: string;
    total: number;
    tel: string;
    orderId: number;
  }): Promise<Payment> => {
    return api.post(`${this.route}/cash/`, data).then((response)=>response.data)
  }
}
