import axios from "axios";
import { API_BASE_URL } from "../config/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    // ✅ Utilisation de set
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

export default apiClient;
