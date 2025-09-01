import { API_BASE_URL } from "../config/api"; 
import apiClient from './intercepteur';


export interface InvitationRequest {
  idFormation: number;
  sujet: string;
  message: string;
}

export interface InvitationResponse {
  success: boolean;
  message: string;
}

const BASE_URL = API_BASE_URL;

export async function sendInvitationMail(data: InvitationRequest): Promise<InvitationResponse> {
  try {
    const response = await apiClient.post<InvitationResponse>(`${BASE_URL}/mail/send-invitation`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    // Gestion simple des erreurs
    throw new Error(
      error.response?.data?.message || error.message || "Erreur lors de l'envoi de l'invitation"
    );
  }
}
