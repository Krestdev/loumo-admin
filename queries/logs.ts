import api from "@/providers/axios";
import { Log } from "@/types/types";

export default class LogQuery {
  route = "/logs";
  create = async (data: Omit<Log, "id"> & { userId: number }): Promise<Log> => {
    return api.post(`${this.route}`, data).then((response) => response.data);
  };

  getAll = async (): Promise<Log[]> => {
    return api.get(`${this.route}/`).then((response) => {
      return response.data;
    });
  };

  getOne = async (id: number): Promise<Log> => {
    return api.get(`${this.route}/${id}`).then((response) => response.data);
  };

  update = async (
    id: number,
    data: Partial<Omit<Log, "id">> & { userId?: number }
  ): Promise<Log> => {
    return api
      .put(`${this.route}/${id}`, data)
      .then((response) => response.data);
  };

  delete = async (id: number): Promise<Log> => {
    return api.delete(`${this.route}/${id}`).then((response) => response.data);
  };
}
