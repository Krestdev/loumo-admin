import api from "@/providers/axios";
import { Category } from "@/types/types";
import { toast } from "react-toastify";

export default class CategoryQuery {
  route = "/categories";
  create = async (
    data: Omit<Category, "id"> & { productIds?: number[] }
  ): Promise<Category> => {
    return api.post(`${this.route}`, data).then((response) => {
      toast.success(`Catégorie ${response.data.category.name} créée avec succès`);
      return response.data;
    });
  };

  getAll = async (): Promise<Category[]> => {
    return api.get(`${this.route}`).then((response) => {
      return response.data;
    });
  };

  getOne = async (id: number): Promise<Category> => {
    return api.get(`${this.route}/${id}`).then((response) => response.data);
  };

  update = async (
    id: number,
    data: Partial<Omit<Category, "id">> & { productIds: number[] }
  ): Promise<Category> => {
    return api
      .put(`${this.route}/${id}`, data)
      .then((response) => response.data);
  };

  delete = async (id: number): Promise<Category> => {
    return api.delete(`/${this.route}/${id}`).then((response) => response.data);
  };
}
