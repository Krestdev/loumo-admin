// lib/axios.ts
import { notifyError } from "@/lib/notify";
import axios from "axios";
import { toast } from "react-toastify";

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
    toast.error("Request setup error.");
    return Promise.reject(error);
  }
);

// Response Interceptor: Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si le serveur a renvoyé un message
    if (error.response?.data?.message) {
      notifyError("Erreur", error.response.data.message);
    } 
    // Sinon afficher un message générique
    else {
      notifyError("Erreur réseau", "Une erreur inattendue est survenue.");
    }

    return Promise.reject(error);
  }
);

export default api;
