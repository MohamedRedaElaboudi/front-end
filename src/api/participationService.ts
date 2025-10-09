import { API_BASE_URL } from "../config/api"; 
import apiClient from "./intercepteur";

const API_URL = API_BASE_URL;

// Ajouter une participation
export async function ajouterParticipation(data: { employe: { id: number }; formation: { id: number } }) {
  return apiClient.post(`${API_URL}/participations`, data).then(res => res.data);
}

// Récupérer toutes les formations (pour Select)
export async function getAllFormations() {
  const response = await apiClient.get(`${API_URL}/formations`);
  return response.data;
}

// Récupérer tous les participants (à adapter selon ta route API)
export async function getAllParticipants(id: number) {
  const response = await apiClient.get(`${API_URL}/participations/formation/${id}`);
  return response.data; // tableau participants
}
// Supprimer une participation (participant d'une formation)
export async function deleteParticipation(employeId: number, formationId: number) {
  return apiClient.delete(`${API_URL}/participations`, {
    data: {
      employe: employeId,
      formation: formationId
    }
  }).then(res => res.data);
}