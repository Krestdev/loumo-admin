import { notifyInfo, notifySuccess } from "@/lib/notify";
import { User } from "@/types/types";
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
  lastActivity: number;
  updateActivity: () => void;
};
type LoadingState = {
  isLoading: boolean;
  setLoading: (value: boolean) => void;
};


export const useStore = create<Store & LoadingState>()(
  persist(
    (set, get) => ({
      isHydrated: false,
      token: null,
      isLoading: false,
      lastActivity: Date.now(),
      setLoading: (value) => set(() => ({ isLoading: value })),
      user: null,
      setToken: (token) => set(() => ({ token })),
      login: (user) =>{
        set(() => ({ user }));
        notifySuccess("Connexion réuissie !", `Bon retour ${user.name}`)
      },
      logout: () => {
        set({ user: null });
        notifyInfo("Vous avez été déconnecté avec succès !");
      },
      reLogin: () =>
        set(() => ({
          user: null,
        })),
      updateActivity: () => set({ lastActivity: Date.now() }),
      setIsHydrated: (v) => set({ isHydrated: v }),
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
