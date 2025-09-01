import { API_BASE_URL } from "../config/api"; 
import apiClient from "./intercepteur";

const API_URL = API_BASE_URL;

// Exporter explicitement le type Formation
export interface Formulaire {
  id: number;
}

export interface FormationStats {
  statut: string; 
  count: number;   
}

export type Formation = {
  id: number;
  theme: string;
  lieu: string;
  dateDebut: string;
  dateFin: string;
  type?: string;
  statut?: string;
  formateur?: { id: number; nomFormateur?: string };
  formulaire: Formulaire; 
};

// --- Formations ---
export async function getAllFormations() {
  const response = await apiClient.get(`${API_URL}/formations`);
  console.log("Response formations API:", response.data);
  return response.data;
}

export async function getFormationById(id: number) {
  const response = await apiClient.get(`${API_URL}/formations/${id}`);
  return response.data;
}

export async function ajouterFormation(formation: {
  theme: string;
  lieu: string;
  type: string;
  statut: string;
  dateDebut: string;
  dateFin: string;
  formateur: { id: number };
}) {
  const response = await apiClient.post(`${API_URL}/formations`, formation);
  return response.data;
}

export async function updateFormation(id: number, formation: any) {
  const response = await apiClient.put(`${API_URL}/formations/${id}`, formation);
  return response.data;
}

// --- Formateurs ---
export async function getAllFormateurs() {
  const response = await apiClient.get(`${API_URL}/formateurs`);
  return response.data;
}

export async function getFormateurById(id: number) {
  const response = await apiClient.get(`${API_URL}/formateurs/${id}`);
  return response.data;
}

export async function ajouterFormateur(formateur: {
  cneFormateur: string;
  nomFormateur: string;
  typeFormateur: string;
}) {
  const response = await apiClient.post(`${API_URL}/formateurs`, formateur);
  return response.data;
}

export async function updateFormateur(
  id: number,
  formateur: {
    nomFormateur: string;
    cneFormateur: string;
    typeFormateur: string;
  }
) {
  const response = await apiClient.put(`${API_URL}/formateurs/${id}`, formateur);
  return response.data;
}

export async function deleteFormation(id: number) {
  const response = await apiClient.delete(`${API_URL}/formations/${id}`);
  return response.data;
}

// --- Formation Stats ---
export async function getFormationStats(): Promise<FormationStats[]> {
  try {
    const token = localStorage.getItem("token"); // récupère ton JWT
    const response = await apiClient.get(`${API_URL}/formations/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = response.data;

    let stats: FormationStats[] = [];
    if (Array.isArray(data)) {
      stats = data.map((item: any) => ({
        statut: item.statut,
        count: parseInt(item.count, 10) || 0,
      }));
    } else if (typeof data === "object" && data !== null) {
      stats = Object.entries(data).map(([statut, count]) => ({
        statut,
        count: parseInt(count as string, 10) || 0,
      }));
    }

    console.log("Formation Stats API:", stats);
    return stats;
  } catch (error: any) {
    console.error("Erreur getFormationStats:", error.response?.status, error.response?.data);
    return [];
  }
}