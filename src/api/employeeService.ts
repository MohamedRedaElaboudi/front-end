import { API_BASE_URL } from "../config/api"; // Lit import.meta.env.VITE_API_BASE_URL
import apiClient from "./intercepteur"; 

const EMPLOYEE_URL = `${API_BASE_URL}/employes`;
const SERVICES_URL = `${API_BASE_URL}/services`;

export async function getEmployeeById(id: number) {
  const response = await apiClient.get(`${EMPLOYEE_URL}/${id}`);
  return response.data;
}

export async function getEmployeeByCne(cne: string) {
  const response = await apiClient.get(`${EMPLOYEE_URL}/cne/${cne}`);
  return response.data;
}

export async function addEmployee(data: any) {
  const response = await apiClient.post(EMPLOYEE_URL, data, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
}

export async function getAllEmployees() {
  const response = await apiClient.get(EMPLOYEE_URL);
  return response.data;
}

export async function deleteEmployee(id: number) {
  const response = await apiClient.delete(`${EMPLOYEE_URL}/${id}`);
  return response.data;
}

export async function updateEmployee(id: number, data: any) {
  const response = await apiClient.put(`${EMPLOYEE_URL}/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

export async function getAllServices() {
  const response = await apiClient.get(SERVICES_URL);
  return response.data;
}
