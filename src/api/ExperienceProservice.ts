// src/services/experienceService.ts
import { API_BASE_URL } from "../config/api";

import apiClient from "./intercepteur"; // ton client Axios configuré
const EXPERIENCE_URL = `${API_BASE_URL}/experiences`;

// Récupérer toutes les expériences d'un employé
export const getExperiencesByEmploye = async (employeId: number) => {
  const response = await apiClient.get(`${EXPERIENCE_URL}/employe/${employeId}`);
  return response.data;
};

// Récupérer une expérience par ID
export const getExperienceById = async (id: number) => {
  const response = await apiClient.get(`${EXPERIENCE_URL}/${id}`);
  return response.data;
};

// Créer une nouvelle expérience professionnelle
export const createExperience = async (experience: any) => {
  const response = await apiClient.post(`${EXPERIENCE_URL}`, experience);
  return response.data;
};

// Mettre à jour une expérience professionnelle
export const updateExperience = async (id: number, experience: any) => {
  const response = await apiClient.put(`${EXPERIENCE_URL}/${id}`, experience);
  return response.data;
};

// Supprimer une expérience professionnelle
export const deleteExperience = async (id: number) => {
  const response = await apiClient.delete(`${EXPERIENCE_URL}/${id}`);
  return response.data;
};
