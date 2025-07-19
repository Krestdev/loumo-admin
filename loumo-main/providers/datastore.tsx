import { ToastData, User } from "@/types/types";
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
  token: string | null;
  setToken: (token: string) => void;
};
type LoadingState = {
  isLoading: boolean;
  setLoading: (value: boolean) => void;
};

interface ToastStore {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, "id">) => void;
  removeToast: (id: string) => void;
}

export const useStore = create<Store & LoadingState & ToastStore>()(
  persist(
    (set, get) => ({
      isHydrated: false,
      token: null,
      isLoading: false,
      toasts: [],
      setLoading: (value) => set(() => ({ isLoading: value })),
      user: null,
      setToken: (token) => set(() => ({ token })),
      login: (user) => set(() => ({ user })),
      logout: () => {
        set({ user: null });
        toast.info("Vous avez été déconnecté avec succès !");
      },
      reLogin: () =>
        set(() => ({
          user: null,
        })),
      setIsHydrated: (v) => set({ isHydrated: v }),
      addToast: (toast) =>
        set((state) => ({
          toasts: [...state.toasts, { id: crypto.randomUUID(), ...toast }],
        })),
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        })),
    }),
    {
      name: "loumoshop-admin",
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        state?.setIsHydrated(true); // ✅ proper Zustand update
      },
    }
  )
);
