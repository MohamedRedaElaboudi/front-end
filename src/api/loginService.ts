// src/services/authService.ts
import axios from "axios";
import { API_BASE_URL } from "../config/api";

interface LoginResponse {
  token: string;
}

export async function login(email: string, motDePasse: string): Promise<string> {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/auth/login`,
      { email, motDePasse },
      { headers: { "Content-Type": "application/json" } }
    );

    const token = response.data.token;

    // Stocker le token dans localStorage
    localStorage.setItem("jwtToken", token);

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

/**
 * Déconnecte côté client et serveur
 */
export async function logout(): Promise<void> {
  const token = getToken();

  try {
    if (token) {
      // Appel API logout si le backend gère ça
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  } catch (error) {
    console.warn("Erreur côté serveur lors du logout :", error);
    // même si erreur côté serveur, on supprime le token local
  } finally {
    localStorage.removeItem("jwtToken");
  }
}
