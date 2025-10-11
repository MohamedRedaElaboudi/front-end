import apiClient from "./intercepteur"; // ✅ on utilise le même intercepteur
import { API_BASE_URL } from "../config/api";

const API_URL = API_BASE_URL;

/* ================== Réponses Utilisateur ================== */
export const ReponsesUtilisateurService = {
  getAll: async () => {
    const response = await apiClient.get(`${API_URL}/reponses-utilisateurs`);
    return response.data;
  },

  add: async (data: any) => {
    const response = await apiClient.post(`${API_URL}/reponses-utilisateurs`, data);
    return response.data;
  },

  addMany: async (data: any[]) => {
    const response = await apiClient.post(`${API_URL}/reponses-utilisateurs/add-many`, data);
    return response.data;
  },
};

/* ================== Questions Standard ================== */
export const QuestionsService = {
  getAll: async () => {
    const response = await apiClient.get(`${API_URL}/question-standard`);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`${API_URL}/question-standard/${id}`);
    return response.data;
  },

  create: async (data: { texteQuestion: string; reponsesPossibles: string[] }) => {
    const response = await apiClient.post(`${API_URL}/question-standard`, data);
    return response.data;
  },

  update: async (id: number, data: { texteQuestion: string; reponsesPossibles: string[] }) => {
    const response = await apiClient.put(`${API_URL}/question-standard/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`${API_URL}/question-standard/${id}`);
    return response.data;
  },
};

/* ================== Formulaires de Formation ================== */
export const FormulairesService = {
  getById: async (id: number) => {
    const response = await apiClient.get(`${API_URL}/formulaires/${id}`);
    return response.data;
  },

  getByFormationId: async (formationId: number) => {
    const response = await apiClient.get(`${API_URL}/formulaires/formation/${formationId}`);
    return response.data;
  },
};

/* ================== Réponses Possibles ================== */
export const ReponsesPossiblesService = {
  getAll: async () => {
    const response = await apiClient.get(`${API_URL}/reponses-possibles`);
    return response.data;
  },

  add: async (data: any) => {
    const response = await apiClient.post(`${API_URL}/reponses-possibles`, data);
    return response.data;
  },

  getByQuestion: async (questionId: number) => {
    const response = await apiClient.get(`${API_URL}/reponses-possibles/question/${questionId}`);
    return response.data;
  },
};
