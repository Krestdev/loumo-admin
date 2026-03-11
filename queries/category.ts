import api from "@/providers/axios";
import { Category } from "@/types/types";
import { toast } from "react-toastify";

export default class CategoryQuery {
  route = "/categories";
  create = async (
    data: Omit<Category, "id" | "imgUrl" | "children"> & { productIds?: number[], imgUrl?: null | File}
  ): Promise<Category> => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("status",String(data.status));
    formData.append("display",String(data.display));
    if(data.parentId) formData.append("parentId", String(data.parentId));
    if(data.imgUrl) {
    formData.append("imgUrl", data.imgUrl); // "image" should match your backend field name
  }
    const response = await api.post(`${this.route}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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
    data: Partial<Omit<Category, "id"| "imgUrl">> & {imgUrl?: string | null | File}
  ): Promise<Category> => {
    const formData = new FormData();
    if(data.name)formData.append("name", data.name);
    if(data.parentId) formData.append("parentId", String(data.parentId));
    if(data.status !== undefined)formData.append("status",String(data.status));
    if(data.display !== undefined)formData.append("display",String(data.display));
    if(data.imgUrl instanceof File)formData.append("imgUrl", data.imgUrl);
    return api
      .put(`${this.route}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
      .then((response) => response.data);
  };

  delete = async (id: number): Promise<Category> => {
    return api.delete(`${this.route}/${id}`).then((response) => response.data);
  };
}
