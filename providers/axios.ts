// lib/axios.ts
import axios, { AxiosError, AxiosResponse } from "axios";
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
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
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
  (response: AxiosResponse) => {
    const { method, url } = response.config;
    const successMessageFromBackend = (response.data as any)?.message;

    const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(
      method?.toUpperCase() || ""
    );

    if (isMutation && url) {
      // ✅ Extract the entity = first word after '/api/'
      const match = url.match(/\/api\/([^\/\?]+)/);
      let entity = match?.[1] || "Entity";

      // Capitalize and singularize
      entity =
        entity.charAt(0).toUpperCase() + entity.slice(1).replace(/s$/, "");

      const actionMap: Record<string, string> = {
        POST: "created",
        PUT: "updated",
        PATCH: "updated",
        DELETE: "deleted",
      };
      const action = actionMap[method?.toUpperCase() || ""] || "processed";

      const finalMessage =
        successMessageFromBackend || `${entity} ${action} successfully.`;

      toast.success(finalMessage);
    }

    return response;
  },
  (error: AxiosError) => {
    const res = error.response;
    const message =
      (res?.data as any)?.message || "An unexpected error occurred.";

    if (res) {
      switch (res.status) {
        case 400:
          toast.warning(message); // e.g., "Missing required fields"
          break;
        case 401:
          toast.error(message || "Unauthorized. Please log in again.");
          break;
        case 403:
          toast.error(message || "Access denied.");
          break;
        case 404:
          toast.info(message || "Resource not found.");
          break;
        case 500:
          toast.error(message || "Internal server error.");
          break;
        default:
          toast.error(message);
      }
    } else if (error.request) {
      toast.error("No response from server. Check your internet connection.");
    } else {
      toast.error(`Error: ${error.message}`);
    }

    return Promise.reject(error);
  }
);

export default api;
