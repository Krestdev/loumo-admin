import api from "@/providers/axios";
import { Setting } from "@/types/types";

export default class SettingQuery {
  route = "/settings";
  create = async (data: Omit<Setting, "id">): Promise<Setting> => {
    return api.post(`${this.route}`, data).then((response) => response.data);
  };

  getAll = async (section?: string): Promise<Setting[]> => {
    return api
      .get(`${this.route}/?section=${section ? section : ""}`)
      .then((response) => {
        return response.data;
      });
  };

  getOne = async (id: number): Promise<Setting> => {
    return api.get(`${this.route}/${id}`).then((response) => response.data);
  };

  update = async (
    id: number,
    data: Partial<Omit<Setting, "id">> & { faqIds?: number }
  ): Promise<Setting> => {
    return api
      .put(`${this.route}/${id}`, data)
      .then((response) => response.data);
  };

  delete = async (id: number): Promise<Setting> => {
    return api.delete(`${this.route}/${id}`).then((response) => response.data);
  };
}
