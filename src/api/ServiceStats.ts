// src/api/statsService.ts
import apiClient from "./intercepteur";

export interface QuestionStats {
  questionId: number;
  questionLibelle: string;
  reponsePourcentages: Record<string, number>; // clé = réponse, valeur = %
}

// 📊 Récupération des stats par question
export const getFormationStats = async (
  formationId: number
): Promise<QuestionStats[]> => {
  const response = await apiClient.get<QuestionStats[]>(
    `/stats/formation/${formationId}`
  );
  return response.data;
};

// 👥 Récupération du nombre de participants
export const getFormationParticipants = async (
  formationId: number
): Promise<number> => {
  const response = await apiClient.get<number>(
    `/stats/formation/${formationId}/participants`
  );
  return response.data;
};

// 📈 Récupération du taux de réponse
export const getFormationTauxReponse = async (
  formationId: number
): Promise<number> => {
  const response = await apiClient.get<number>(
    `/stats/formation/${formationId}/taux-reponse`
  );
  return response.data;
};
