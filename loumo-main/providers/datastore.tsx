import {
  Category,
  Order,
  OrderItem,
  ProductVariant,
  User,
} from "@/types/types";
import { toast } from "react-toastify";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Store = {
  isHydrated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  reLogin: () => void;
  setIsHydrated: (v: boolean) => void;
};
type LoadingState = {
  isLoading: boolean;
  setLoading: (value:boolean)=>void;
}

export const useStore = create<Store&LoadingState>()(
  persist(
    (set, get) => ({
      isHydrated: false,
      isLoading: false,
      setLoading: (value) => set(() => ({ isLoading: value })),
      user: null,
      login: (user) => set(() => ({ user })),
      logout: () => {set({ user: null }); toast.info("Vous avez été déconnecté avec succès !")},
      reLogin: () =>
        set(() => ({
          user: null,
        })),
        setIsHydrated: (v) => set({ isHydrated: v }),
    }),
    {
      name: "ecommerce-store",
      storage: createJSONStorage(() => sessionStorage),
       onRehydrateStorage: () => (state) => {
        state?.setIsHydrated(true); // ✅ proper Zustand update
      },
    }
));