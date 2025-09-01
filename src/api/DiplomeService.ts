// src/services/diplomeService.ts
import { API_BASE_URL } from "../config/api";
import apiClient from "./intercepteur";

const DIPLOME_URL = `${API_BASE_URL}/diplomes`;

// Récupérer un diplôme par ID
export const getDiplomeById = async (id: number) => {
  const response = await apiClient.get(`${DIPLOME_URL}/${id}`);
  return response.data;
};

// Créer un nouveau diplôme
export const createDiplome = async (diplomeData: any) => {
  const response = await apiClient.post(DIPLOME_URL, diplomeData);
  return response.data;
};

// Mettre à jour un diplôme
export const updateDiplome = async (id: number, diplomeData: any) => {
  const response = await apiClient.put(`${DIPLOME_URL}/${id}`, diplomeData);
  return response.data;
};

// Supprimer un diplôme
export const deleteDiplome = async (id: number) => {
  const response = await apiClient.delete(`${DIPLOME_URL}/${id}`);
  return response.data;
};

// Récupérer les diplômes d’un employé
export const getDiplomesByEmploye = async (employeId: number) => {
  const response = await apiClient.get(`${DIPLOME_URL}/employe/${employeId}`);
  return response.data;
};
