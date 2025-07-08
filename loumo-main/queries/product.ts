import api from "@/providers/axios";
import { Product } from "@/types/types";
import { toast } from "react-toastify";

export default class ProductQuery {
  route = "/products";
  create = async (
    data: Omit<Product, "id" | "createdAt" | "updatedAt"> & { categoryId: number }
  ): Promise<Product> => {
    const response = await api.post(`${this.route}`, data);
    const product = response.data;

    console.log("👉 Response complète :", product);
    if (!product) throw new Error("Missing product in response");
    toast.success(`Variante ${product.name} créée avec succès`);
    return product;
  };

  getAll = async (): Promise<Product[]> => {
    return api.get(`${this.route}`).then((response) => {
      return response.data;
    });
  };

  getOne = async (id: number): Promise<Product> => {
    return api.get(`${this.route}/${id}`).then((response) => response.data);
  };

  getOneBySlug = async (slug: string): Promise<Product> => {
    return api
      .get(`${this.route}/slug/${slug}`)
      .then((response) => response.data);
  };

  update = async (
    id: number,
    data: Partial<Omit<Product, "id">> & { categoryId?: number }
  ): Promise<Product> => {
    return api
      .put(`${this.route}/${id}`, data)
      .then((response) => response.data);
  };

  bulckUpdate = async (ids: number[], p0: { categoryId: number | undefined; status: boolean; }, data: {
    product: Partial<Product>[];
    categoryId?: number;
    status?: boolean;
}): Promise<Product> => {
    return api
      .post(`${this.route}/bulckupdate`, data)
      .then((response) => response.data);
  };

  delete = async (id: number): Promise<Product> => {
    return api.delete(`${this.route}/${id}`).then((response) => response.data);
  };

  bulckDelete = async (ids: number[]): Promise<Product> => {
    return api
      .put(`${this.route}/delete/bulck`, { ids:ids })
      .then((response) => response.data);
  };
}
