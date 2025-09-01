// src/api/responsableService.ts
import apiClient from "./intercepteur";

// Interface TypeScript pour un Responsable
export interface Responsable {
  id: number;
  nom: string;
    cne?: string;

  prenom: string;
  email: string;
  telephone?: string;
  fonction?: string;
}

// Récupérer le responsable connecté via token
export const getResponsableMe = async (): Promise<Responsable> => {
  const response = await apiClient.get<Responsable>("/responsables/me");
  return response.data;
};

// Récupérer un responsable par ID
export const getResponsableById = async (id: number): Promise<Responsable> => {
  const response = await apiClient.get<Responsable>(`/responsables/${id}`);
  return response.data;
};

// Mettre à jour un responsable
export const updateResponsable = async (
  id: number,
  data: Partial<Responsable>
): Promise<Responsable> => {
  const response = await apiClient.put<Responsable>(`/responsables/${id}`, data);
  return response.data;
};

// Supprimer un responsable
export const deleteResponsable = async (id: number): Promise<void> => {
  await apiClient.delete(`/responsables/${id}`);
};

// Récupérer tous les responsables
export const getAllResponsables = async (): Promise<Responsable[]> => {
  const response = await apiClient.get<Responsable[]>("/responsables");
  return response.data;
};

// Créer un nouveau responsable
export const createResponsable = async (
  data: Partial<Responsable>
): Promise<Responsable> => {
  const response = await apiClient.post<Responsable>("/responsables", data);
  return response.data;
};

// Récupérer un responsable par email
export const getResponsableByEmail = async (email: string): Promise<Responsable> => {
  const response = await apiClient.get<Responsable>(`/responsables/email/${email}`);
  return response.data;
};
