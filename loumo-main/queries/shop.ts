import api from "@/providers/axios";
import { Address, Shop } from "@/types/types";

type ZoneShop = {
  name: string;
  address: Omit<Address, "id" | "createdAt" | "updatedAt" | "zoneId">;
  description?:string;
  price: number;
  status: string;
}

export default class ShopQuery {
  route = "/shops";
  create = async (
    data: Omit<Shop, "id"> & { addressId?: number | null} & {zone?: ZoneShop}
  ): Promise<Shop> => {
    const {addressId, zone,...props} = data;
    if(!!zone){
      return api.post(`${this.route}`, {...props, zone}).then((response) => response.data);
    } else {
      return api.post(`${this.route}`, {...props, addressId}).then((response) => response.data);
    }
  };

  getAll = async (): Promise<Shop[]> => {
    return api.get(`${this.route}/`).then((response) => {
      return response.data;
    });
  };

  getOne = async (id: number): Promise<Shop> => {
    return api.get(`${this.route}/${id}`).then((response) => response.data);
  };

  update = async (
    id: number,
    data: Partial<Omit<Shop, "id">> & { addressId?: number }
  ): Promise<Shop> => {
    return api
      .put(`${this.route}/${id}`, data)
      .then((response) => response.data);
  };

  delete = async (id: number): Promise<Shop> => {
    return api.delete(`${this.route}/${id}`).then((response) => response.data);
  };
}
