import api from "@/providers/axios";
import { ProductVariant } from "@/types/types";
import { toast } from "react-toastify";

export default class ProductVariantQuery {
  route = "/productvariants";
  create = async (
  data: Omit<ProductVariant, "id" | "stock"> & { productId: number }
): Promise<Omit<ProductVariant, "stock">> => {
  const response = await api.post(`${this.route}`, data);
  const variant = response.data;

  console.log("👉 Response complète :", variant);

  if (!variant) throw new Error("Missing variant in response");

  toast.success(`Variante ${variant.name} créée avec succès`);
  return variant;
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
