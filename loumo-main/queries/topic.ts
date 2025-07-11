import api from "@/providers/axios";
import { Topic } from "@/types/types";

export default class TopicQuery {
  route = "/topics";
  create = async (data: Omit<Topic, "id" | "faqs">): Promise<Topic> => {
    return api.post(`${this.route}`, data).then((response) => response.data);
  };

  getAll = async (): Promise<Topic[]> => {
    return api.get(`${this.route}/`).then((response) => {
      return response.data;
    });
  };

  getOne = async (id: number): Promise<Topic> => {
    return api.get(`${this.route}/${id}`).then((response) => response.data);
  };

  update = async (
    id: number,
    data: Partial<Omit<Topic, "id">> & { faqIds?: number }
  ): Promise<Topic> => {
    return api
      .put(`${this.route}/${id}`, data)
      .then((response) => response.data);
  };

  delete = async (id: number): Promise<Topic> => {
    return api.delete(`${this.route}/${id}`).then((response) => response.data);
  };
}
