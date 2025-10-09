// src/services/authService.ts
import axios from "axios";
import { API_BASE_URL } from "../config/api";

interface LoginResponse {
  token: string;
  email: string;
  role: string;
}

// --- Login ---
export async function login(
  email: string,
  motDePasse: string
): Promise<{ token: string; email: string; role: string }> {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/auth/login`,
      { email, motDePasse },
      { headers: { "Content-Type": "application/json" } }
    );

    const { token, email: userEmail, role } = response.data;

    // Stockage local
    localStorage.setItem("jwtToken", token);
    localStorage.setItem("userEmail", userEmail);
    localStorage.setItem("userRole", role);

    return { token, email: userEmail, role };
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Erreur lors de la connexion"
    );
  }
}

// --- Get token/email/role ---
export function getToken(): string | null {
  return localStorage.getItem("jwtToken");
}

export function getUserEmail(): string | null {
  return localStorage.getItem("userEmail");
}

export function getUserRole(): string | null {
  return localStorage.getItem("userRole");
}

// --- Logout ---
export async function logout(): Promise<void> {
  const token = getToken();

  try {
    if (token) {
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  } catch (error) {
    console.warn("Erreur côté serveur lors du logout :", error);
  } finally {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
  }
}
