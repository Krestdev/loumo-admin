import api from "@/providers/axios";
import { NotificationT } from "@/types/types";

export default class NotificationQuery {
  route = "/notifications";
  create = async (
    data: Omit<Notification, "id"> & { userId: number }
  ): Promise<NotificationT> => {
    return api.post(`${this.route}`, data).then((response) => response.data);
  };

  getAll = async (): Promise<NotificationT[]> => {
    return api.get(`${this.route}/`).then((response) => {
      return response.data;
    });
  };

  getOne = async (id: number): Promise<NotificationT> => {
    return api.get(`${this.route}/${id}`).then((response) => response.data);
  };

  update = async (
    id: number,
    data: Partial<Omit<Notification, "id">> & { userId?: number }
  ): Promise<NotificationT> => {
    return api
      .put(`${this.route}/${id}`, data)
      .then((response) => response.data);
  };

  delete = async (id: number): Promise<NotificationT> => {
    return api.delete(`${this.route}/${id}`).then((response) => response.data);
  };
}
