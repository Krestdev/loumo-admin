import api from "@/providers/axios";
import { Faq } from "@/types/types";

export default class FaqQuery {
  route = "/faqs";
  create = async (
    data: Omit<FrameRequestCallback, "id"> & { topicId: number }
  ): Promise<Faq> => {
    return api.post(`${this.route}`, data).then((response) => response.data);
  };

  getAll = async (): Promise<Faq[]> => {
    return api.get(`${this.route}/`).then((response) => {
      return response.data;
    });
  };

  getOne = async (id: number): Promise<Faq> => {
    return api.get(`${this.route}/${id}`).then((response) => response.data);
  };

  update = async (
    id: number,
    data: Partial<Omit<Faq, "id">> & { topicId?: number }
  ): Promise<Faq> => {
    return api
      .put(`${this.route}/${id}`, data)
      .then((response) => response.data);
  };

  delete = async (id: number): Promise<Faq> => {
    return api.delete(`${this.route}/${id}`).then((response) => response.data);
  };
}
