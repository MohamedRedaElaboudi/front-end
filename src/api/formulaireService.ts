import axios from "axios";
import { API_BASE_URL } from "../config/api"; // Assure-toi que cette constante est bien définie

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/* ================== Réponses Utilisateur ================== */
export const ReponsesUtilisateurService = {
  getAll: async () => {
    const response = await apiClient.get("/reponses-utilisateurs");
    return response.data;
  },

  add: async (data: any) => {
    const response = await apiClient.post("/reponses-utilisateurs", data);
    return response.data;
  },

  addMany: async (data: any[]) => {
    const response = await apiClient.post("/reponses-utilisateurs/add-many", data);
    return response.data;
  },
};

/* ================== Questions Standard ================== */
export const QuestionsService = {
  getAll: async () => {
    const response = await apiClient.get("/question-standard");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/question-standard/${id}`);
    return response.data;
  },

  create: async (data: { texteQuestion: string; reponsesPossibles: string[] }) => {
    const response = await apiClient.post("/question-standard", data);
    return response.data;
  },

  update: async (id: number, data: { texteQuestion: string; reponsesPossibles: string[] }) => {
    const response = await apiClient.put(`/question-standard/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/question-standard/${id}`);
    return response.data;
  },
};

/* ================== Formulaires de Formation ================== */
export const FormulairesService = {
  getById: async (id: number) => {
    const response = await apiClient.get(`/formulaires/${id}`);
    return response.data;
  },

  getByFormationId: async (formationId: number) => {
    const response = await apiClient.get(`/formulaires/formation/${formationId}`);
    return response.data;
  },
};

/* ================== Réponses Possibles ================== */
export const ReponsesPossiblesService = {
  getAll: async () => {
    const response = await apiClient.get("/reponses-possibles");
    return response.data;
  },

  add: async (data: any) => {
    const response = await apiClient.post("/reponses-possibles", data);
    return response.data;
  },

  getByQuestion: async (questionId: number) => {
    const response = await apiClient.get(`/reponses-possibles/question/${questionId}`);
    return response.data;
  },
};
