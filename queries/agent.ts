import api from "@/providers/axios";
import { Agent } from "@/types/types";

export default class AgentQuery {
  route = "/agents";
  create = async (
    data: Omit<Agent, "id" | "code" | "zone"> & {
      userId: number;
    }
  ): Promise<Agent> => {
    return api.post(`${this.route}`, data).then((response) => {
      return response.data;
    });
  };

  getAll = async (): Promise<Agent[]> => {
    return api.get(`${this.route}`).then((response) => {
      return response.data;
    });
  };

  getOne = async (id: number): Promise<Agent> => {
    return api.get(`${this.route}/${id}`).then((response) => response.data);
  };

  update = async (
    id: number,
    data: Partial<Omit<Agent, "id">>/*  & {
      userId: number;
    } */
  ): Promise<Agent> => {
    return api
      .put(`${this.route}/${id}`, data)
      .then((response) => response.data);
  };

  delete = async (id: number): Promise<Agent> => {
    return api.delete(`${this.route}/${id}`).then((response) => response.data);
  };
}
