// src/services/authService.ts
import axios from "axios";
import { API_BASE_URL } from "../config/api";

interface LoginResponse {
  token: string;
}

export async function login(email: string, password: string): Promise<string> {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/auth/login`,
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );

    const token = response.data.token;

    // Stocke le token dans localStorage
    localStorage.setItem("jwtToken", response.data.token);

    return token;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Erreur lors de la connexion"
    );
  }
}
export function getToken(): string | null {
  return localStorage.getItem("jwtToken");
}
