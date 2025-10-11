import apiClient from "./intercepteur"; 
import { API_BASE_URL } from "../config/api";

const EXPERIENCE_URL = `${API_BASE_URL}/experiences`;

export const getExperiencesByEmploye = async (employeId: number) => {
  const response = await apiClient.get(`${EXPERIENCE_URL}/employe/${employeId}`);
  return response.data;
};

export const getExperienceById = async (id: number) => {
  const response = await apiClient.get(`${EXPERIENCE_URL}/${id}`);
  return response.data;
};

export const createExperience = async (experience: any) => {
  const response = await apiClient.post(`${EXPERIENCE_URL}`, experience);
  return response.data;
};

export const updateExperience = async (id: number, experience: any) => {
  const response = await apiClient.put(`${EXPERIENCE_URL}/${id}`, experience);
  return response.data;
};

export const deleteExperience = async (id: number) => {
  const response = await apiClient.delete(`${EXPERIENCE_URL}/${id}`);
  return response.data;
};
