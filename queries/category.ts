import api from "@/providers/axios";
import { Category } from "@/types/types";
import { toast } from "react-toastify";

export default class CategoryQuery {
  route = "/categories";
  create = async (
    data: Omit<Category, "id"> & { productIds?: number[] }
  ): Promise<Category> => {
    const response = await api.post(`${this.route}`, data);
    const category = response.data;

    console.log("👉 Response complète :", category);
    if (!category) throw new Error("Missing product in response");
    toast.success(`Catégorie ${category.name} créée avec succès`);
    return category;
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
    data: Partial<Omit<Category, "id">>
  ): Promise<Category> => {
    return api
      .put(`${this.route}/${id}`, data)
      .then((response) => response.data);
  };

  delete = async (id: number): Promise<Category> => {
    return api.delete(`${this.route}/${id}`).then((response) => response.data);
  };
}
