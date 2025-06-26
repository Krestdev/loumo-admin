import api from "@/providers/axios";
import { ProductVariant } from "@/types/types";
import { toast } from "react-toastify";

export default class ProductVariantQuery {
  route = "/productvariants";
  create = async (
    data: Omit<ProductVariant, "id"> & { productId: number }
  ): Promise<ProductVariant> => {
    return api.post(`${this.route}`, data).then((response) => {
      toast.success(`Welcome back ${response.data.productVariant.name}`);
      return response.data;
    });
  };

  getAll = async (): Promise<ProductVariant[]> => {
    return api.get(`${this.route}`).then((response) => {
      return response.data;
    });
  };

  getOne = async (id: number): Promise<ProductVariant> => {
    return api.get(`${this.route}/${id}`).then((response) => response.data);
  };

  update = async (
    id: number,
    data: Partial<Omit<ProductVariant, "id">> & { productId?: number }
  ): Promise<ProductVariant> => {
    return api
      .put(`${this.route}/${id}`, data)
      .then((response) => response.data);
  };

  delete = async (id: number): Promise<ProductVariant> => {
    return api.delete(`${this.route}/${id}`).then((response) => response.data);
  };
}
