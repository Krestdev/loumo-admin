import api from "@/providers/axios";
import { newProduct, Product } from "@/types/types";
import { toast } from "react-toastify";

export default class ProductQuery {
  route = "/products";
  create = async (
    //data: Omit<Product, "id" | "createdAt" | "updatedAt"> & { categoryId: number }
    data: newProduct
  ): Promise<Product> => {
    const response = await api.post(`${this.route}`, data);
    const product = response.data;

    console.log("👉 Response complète :", product);
    if (!product) throw new Error("Missing product in response");
    toast.success(`Variante ${product.name} créée avec succès`);
    return product;
  };

  createWithImages = async (
    //data: Omit<Product, "id" | "createdAt" | "updatedAt"> & { categoryId: number }
    data: newProduct
  ): Promise<Product> => {
    const existingProducts = await this.getAll(); //Getting existing products to prevent doubles

    // 2️⃣ Normalize names (trim + lowercase)
    const normalizedName = data.name.trim().toLowerCase();
    const productNames = existingProducts.map((p) =>
      p.name.trim().toLowerCase()
    );

    // 3️⃣ Check duplicates
    if (productNames.includes(normalizedName)) {
      toast.error(`Le produit "${data.name}" existe déjà`);
      throw new Error(`Duplicate product name: ${data.name}`);
    }

    const formData = new FormData();

    // Extraire les images
    const images: File[] = [];
    const variantsWithoutImg = data.variants.map((v) => {
      if (v.imgUrl) images.push(v.imgUrl);
      const { imgUrl, ...rest } = v;
      console.log(imgUrl);
      return rest;
    });

    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("status", String(data.status));
    formData.append("categoryId", String(data.categoryId));
    formData.append("weight", String(data.weight));
    // Ajouter les variants sans image sous forme de JSON
    formData.append("variants", JSON.stringify(variantsWithoutImg));

    // Ajouter les images
    images.forEach((file) => {
      formData.append("variantImages", file);
    });

    const response = await api.post(`${this.route}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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

  bulckUpdate = async (
    ids: number[],
    p0: { categoryId: number | undefined; status: boolean },
    data: {
      product: Partial<Product>[];
      categoryId?: number;
      status?: boolean;
    }
  ): Promise<Product> => {
    return api
      .post(`${this.route}/bulckupdate`, data)
      .then((response) => response.data);
  };

  delete = async (id: number): Promise<Product> => {
    return api.delete(`${this.route}/${id}`).then((response) => response.data);
  };

  bulckDelete = async (ids: number[]): Promise<Product> => {
    return api
      .put(`${this.route}/delete/bulck`, { ids: ids })
      .then((response) => response.data);
  };
}
