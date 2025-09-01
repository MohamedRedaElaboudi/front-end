import axios from "axios";
import { API_BASE_URL } from "../config/api"; // ou ton fichier de config

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/* ================== Réponses Utilisateur ================== */
export const ReponsesUtilisateurService = {
  // Lister toutes les réponses des utilisateurs
  getAll: async () => {
    const response = await apiClient.get("/reponses-utilisateurs");
    return response.data;
  },

  // Enregistrer une réponse unique
  add: async (data: any) => {
    const response = await apiClient.post("/reponses-utilisateurs", data);
    return response.data;
  },

  // ✅ Enregistrer plusieurs réponses en une seule fois
  addMany: async (data: any[]) => {
    const response = await apiClient.post("/reponses-utilisateurs/add-many", data);
    return response.data;
  },
};

/* ================== Questions Standard ================== */
export const QuestionsService = {
  // Lister toutes les questions
  getAll: async () => {
    const response = await apiClient.get("/questions");
    return response.data;
  },
};

/* ================== Formulaires de Formation ================== */
export const FormulairesService = {
  // Récupérer un formulaire par ID
  getById: async (id: number) => {
    const response = await apiClient.get(`/formulaires/${id}`);
    return response.data;
  },

  // Récupérer un formulaire par ID de formation
  getByFormationId: async (formationId: number) => {
    const response = await apiClient.get(`/formulaires/formation/${formationId}`);
    return response.data;
  },
};

/* ================== Réponses Possibles ================== */
export const ReponsesPossiblesService = {
  // Lister toutes les réponses possibles
  getAll: async () => {
    const response = await apiClient.get("/reponses-possibles");
    return response.data;
  },

  // Créer une réponse possible
  add: async (data: any) => {
    const response = await apiClient.post("/reponses-possibles", data);
    return response.data;
  },

  // Lister les réponses possibles pour une question donnée
  getByQuestion: async (questionId: number) => {
    const response = await apiClient.get(`/reponses-possibles/question/${questionId}`);
    return response.data;
  },
};
