import api from "./api";
import type { AdminQuestion, AdminUser } from "../types/admin";

export async function getAdminUsers() {
  const response = await api.get<AdminUser[]>("/admin/users");

  return response.data;
}

export async function getAdminQuestions() {
  const response = await api.get<AdminQuestion[]>("/admin/questions");

  return response.data;
}
