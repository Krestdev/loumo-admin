import api from "@/providers/axios";
import { Product } from "@/types/types";
import { toast } from "react-toastify";

export default class ProductQuery {
  route = "/products";
  create = async (
    data: Omit<Product, "id" | "createdAt" | "updatedAt"> & { categoryId: number }
  ): Promise<Product> => {
    return api.post(`${this.route}`, data).then((response) => {
      toast.success(`Produit ${response.data.product.name} créé avec succès`);
      return response.data.product;
    });
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
