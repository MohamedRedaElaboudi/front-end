import { API_BASE_URL } from "../config/api";
import apiClient from "./intercepteur";

const API_URL = `${API_BASE_URL}/services`;

export interface Service {
  id: number;
  nom: string;
  domaine: string;
  description: string;
}

// --- Récupérer tous les services ---
export async function getAllServices(): Promise<Service[]> {
  const response = await apiClient.get<Service[]>(API_URL);
  return response.data;
}

// --- Récupérer un service par ID ---
export async function getServiceById(id: number): Promise<Service> {
  const response = await apiClient.get<Service>(`${API_URL}/${id}`);
  return response.data;
}

// --- Créer un nouveau service ---
export async function createService(service: Omit<Service, "id">): Promise<Service> {
  // Vérifie que toutes les propriétés requises sont présentes
  if (!service.nom || !service.domaine || !service.description) {
    throw new Error("Les champs 'nom', 'domaine' et 'description' sont obligatoires.");
  }

  try {
    const response = await apiClient.post<Service>(API_URL, {
      nom: service.nom.trim(),
      domaine: service.domaine.trim(),
      description: service.description.trim(),
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la création du service :", error.response?.data || error.message);
    throw error;
  }
}

// --- Mettre à jour un service par ID ---
export async function updateService(id: number, service: Omit<Service, "id">): Promise<Service> {
  if (!service.nom || !service.domaine || !service.description) {
    throw new Error("Les champs 'nom', 'domaine' et 'description' sont obligatoires.");
  }

  const response = await apiClient.put<Service>(`${API_URL}/${id}`, {
    nom: service.nom.trim(),
    domaine: service.domaine.trim(),
    description: service.description.trim(),
  });
  return response.data;
}

// --- Supprimer un service par ID ---
export async function deleteService(id: number): Promise<void> {
  await apiClient.delete(`${API_URL}/${id}`);
}

// --- Vérifier si un service existe par ID ---
export async function serviceExists(id: number): Promise<boolean> {
  const response = await apiClient.get<boolean>(`${API_URL}/${id}/exists`);
  return response.data;
}

// --- Rechercher des services par nom ---
export async function searchServices(nameQuery: string): Promise<Service[]> {
  const response = await apiClient.get<Service[]>(`${API_URL}/search`, {
    params: { nom: nameQuery },
  });
  return response.data;
}

// --- Récupérer un service par nom exact ---
export async function getServiceByName(nom: string): Promise<Service> {
  const response = await apiClient.get<Service>(`${API_URL}/nom/${nom}`);
  return response.data;
}
