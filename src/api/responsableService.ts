import apiClient from "./intercepteur";

export interface Responsable {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  cne?: string;
  telephone?: string;
  fonction?: string;
}

// Header avec token
const tokenHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

// 🔹 Récupérer le responsable connecté
export const getResponsableMe = async () =>{};

// 🔹 Récupérer par ID
export const getResponsableById = async (id: number) => (await apiClient.get(`/responsables/${id}`)).data;

// 🔹 Créer un responsable
export const createResponsable = async (data: Partial<Responsable>) => (await apiClient.post("/responsables", data)).data;

// 🔹 Modifier un responsable
export const updateResponsable = async (id: number, data: Partial<Responsable>) => (await apiClient.put(`/responsables/${id}`, data)).data;

// 🔹 Supprimer un responsable
export const deleteResponsable = async (id: number) => await apiClient.delete(`/responsables/${id}`);

// 🔹 Récupérer tous les responsables
export const getAllResponsables = async () => (await apiClient.get("/responsables")).data;

// 🔹 Récupérer un responsable par email (encode @ pour éviter les problèmes)
export const getResponsableByEmail = async (email: string) => {
  try {
    const encodedEmail = encodeURIComponent(email);
    const res = await apiClient.get(`/responsables/email/${encodedEmail}`);
    console.log("✅ Réponse API :", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Erreur getResponsableByEmail :", err);
    return null;
  }
};
