import apiClient from "./intercepteur";

// ✅ Interface TypeScript pour un Responsable
export interface Responsable {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  cne?: string;
  telephone?: string;
  fonction?: string;
}

// ✅ Fonction utilitaire pour récupérer le token
const getToken = (): string => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("❌ Aucun token trouvé dans le localStorage.");
    throw new Error("Utilisateur non authentifié");
  }
  return token;
};

// ✅ Récupérer le responsable connecté via token
export const getResponsableMe = async (): Promise<Responsable> => {
  try {
    const token = getToken();
    const response = await apiClient.get<Responsable>("/responsables/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du responsable connecté :", error);
    throw error;
  }
};

// ✅ Récupérer un responsable par ID
export const getResponsableById = async (id: number): Promise<Responsable> => {
  try {
    const response = await apiClient.get<Responsable>(`/responsables/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Erreur lors de la récupération du responsable avec ID ${id} :`, error);
    throw error;
  }
};

// ✅ Mettre à jour un responsable
export const updateResponsable = async (
  id: number,
  data: Partial<Responsable>
): Promise<Responsable> => {
  try {
    const response = await apiClient.put<Responsable>(`/responsables/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`❌ Erreur lors de la mise à jour du responsable ID ${id} :`, error);
    throw error;
  }
};

// ✅ Supprimer un responsable
export const deleteResponsable = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/responsables/${id}`);
  } catch (error) {
    console.error(`❌ Erreur lors de la suppression du responsable ID ${id} :`, error);
    throw error;
  }
};

// ✅ Récupérer tous les responsables
export const getAllResponsables = async (): Promise<Responsable[]> => {
  try {
    const response = await apiClient.get<Responsable[]>("/responsables");
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération de tous les responsables :", error);
    throw error;
  }
};

// ✅ Créer un nouveau responsable
export const createResponsable = async (
  data: Partial<Responsable>
): Promise<Responsable> => {
  try {
    const response = await apiClient.post<Responsable>("/responsables", data);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors de la création du responsable :", error);
    throw error;
  }
};

// ✅ Récupérer un responsable par email avec axios
export const getResponsableByEmail = async (email: string): Promise<Responsable | null> => {
  try {
    const response = await apiClient.get<Responsable>(`/responsables/email/${encodeURIComponent(email)}`);
    console.log("✅ Réponse API :", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur getResponsableByEmail :", error);
    return null;
  }
};