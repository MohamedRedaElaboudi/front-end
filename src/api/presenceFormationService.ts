import { API_BASE_URL } from "../config/api";
import apiClient from "./intercepteur";

const API_URL = `${API_BASE_URL}/presence-formations`;

export interface PresenceId {
  employeId: number;
  formationId: number;
  datePresence?: string;
}

export interface PresenceFormation {
  employe: { id: number };
  formation: { id: number };
  statut: string; 
  datePresence: string;
}

// --- Récupérer toutes les présences ---
export async function getAllPresences(): Promise<PresenceFormation[]> {
  const response = await apiClient.get<PresenceFormation[]>(API_URL);
  return response.data;
}

// --- Récupérer les présences d'une formation spécifique ---
export async function getPresencesByFormation(
  formationId: number
): Promise<PresenceFormation[]> {
  const response = await apiClient.get<PresenceFormation[]>(
    `${API_URL}/formation/${formationId}`
  );
  return response.data;
}

// --- Récupérer la présence d’un employé pour une séance précise ---
export async function getPresenceById(
  employeId: number,
  formationId: number,
  datePresence: string
): Promise<PresenceFormation | null> {
  try {
    const response = await apiClient.get<PresenceFormation>(
      `${API_URL}/${employeId}/${formationId}/${datePresence}`
    );
    return response.data;
  } catch (err) {
    return null; // si aucune présence trouvée
  }
}

// --- Créer une présence ---
export async function createPresence(
  presence: PresenceFormation
): Promise<PresenceFormation> {
  const response = await apiClient.post<PresenceFormation>(API_URL, presence, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
}
