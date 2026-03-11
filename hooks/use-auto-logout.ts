import { useStore } from "@/providers/datastore";
import { useEffect } from "react";

const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes

export function useAutoLogout() {
  const { lastActivity, logout, updateActivity, user } = useStore();

  useEffect(() => {
    if (!user) return; // pas de timer si pas connecté

    const handleActivity = () => updateActivity();

    // Écoute les événements d’activité
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);

    const interval = setInterval(() => {
      if (Date.now() - lastActivity > INACTIVITY_LIMIT) {
        logout();
      }
    }, 60 * 1000); // vérifie toutes les minutes

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      clearInterval(interval);
    };
  }, [lastActivity, logout, updateActivity, user]);
}
