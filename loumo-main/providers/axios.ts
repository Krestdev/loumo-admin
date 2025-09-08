// lib/axios.ts
import { notifyError } from "@/lib/notify";
import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Add Authorization token if available
api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("loumoshop-admin") || "{}")?.state?.token : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    notifyError("Request setup error.");
    return Promise.reject(error);
  }
);

// Response Interceptor: Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // L'API a répondu mais avec une erreur (400, 401, 403, 404, 500...)
      const message =
        error.response.data?.message || "Une erreur est survenue.";
      notifyError("Erreur serveur", message);
    } else if (error.request) {
      // La requête a été envoyée mais pas de réponse (souvent problème réseau)
      if (!navigator.onLine) {
        notifyError("Connexion perdue", "Vous n'êtes plus connecté à Internet.");
      } else {
        notifyError(
          "Serveur injoignable",
          "Impossible de contacter le serveur. Réessayez plus tard."
        );
      }
    } else {
      // Autre type d'erreur (setup, config axios, etc.)
      notifyError("Erreur interne", error.message || "Erreur inconnue.");
    }

    return Promise.reject(error);
  }
);

export default api;
