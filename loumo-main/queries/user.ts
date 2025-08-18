import api from "@/providers/axios";
import { User } from "@/types/types";
import { toast } from "react-toastify";

const allowedAdminRoles = [0,1]; //Update if needed
export default class UserQuery {
  route = "/users";
  login = async (data: {
    email: string;
    password: string;
  }): Promise<{ user: User; token: string }> => {
    return api.post(`${this.route}/login`, data).then((response) => {
      toast.success(`Welcome back ${response.data.user.name}`);
      return response.data;
    });
  };

  //custom config for backoffice
  loginAdmin = async (data: {
  email: string;
  password: string;
}): Promise<{ user: User; token: string }> => {
  /*  // Vérification super admin
  if (data.email === "loumo@loumoshop.com" && data.password === "Krest@2025") {
    return {
      user: {
        id: 0,
        email: data.email,
        password: "", // jamais stocké
        name: "Super Admin",
        roleId: 0,
        verified: true,
        active: true,
        tel: null,
        imageUrl: null,
        fidelity: 0,
        passwordResetOtp: null,
        passwordResetOtpExpires: null,
        verificationOtp: null,
        verificationOtpExpires: null,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      token: "SpecialAdmin"
    };
  } */
  return api
    .post(`${this.route}/login`, data)
    .then((response) => {
      const { user, token } = response.data;

      if (!allowedAdminRoles.includes(user.roleId ?? -1)) {
        throw new Error("401 Accès non autorisé pour ce rôle.");
      }
      return { user, token };
    })
};

  getAll = async (): Promise<User[]> => {
    return api
      .get(`${this.route}/?roleD=true&addressD=true&logD=true&notifD=true`)
      .then((response) => {
        return response.data;
      });
  };
  getAllClients = async (): Promise<User[]> => {
    return api
      .get(`${this.route}/?roleD=true&addressD=true&logD=true&notifD=true&clients=true`)
      .then((response) => {
        return response.data;
      });
  };
  getOne = async (id: number): Promise<User> => {
    return api.get(`${this.route}/${id}`).then((response) => response.data);
  };
  addProductsToFavorite = async (
    id: number,
    productIds: number[]
  ): Promise<User> => {
    return api
      .patch(`${this.route}/${id}`, { productIds })
      .then((response) => response.data);
  };
  register = async (
    data: Partial<User> & {
      addressList?: number[];
    }
  ): Promise<User> => {
    return api.post(`${this.route}`, data).then((response) => response.data);
  };
  update = async (
    id: number,
    data: Partial<Omit<User, "id" | "createdAt">>
  ): Promise<User> => {
    return api.put(`${this.route}/${id}`, data).then((response) => response.data);
  };
  delete = async (id: number) => {
    return api.delete(`${this.route}/${id}`).then((response) => response);
  };
}
