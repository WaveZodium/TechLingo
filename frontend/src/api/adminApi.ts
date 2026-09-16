import api from "./api";
import type { Category } from "../types/category";
import type { AdminQuestion, AdminUser } from "../types/admin";

export async function getAdminUsers() {
  const response = await api.get<AdminUser[]>("/admin/users");

  return response.data;
}

export async function getAdminQuestions() {
  const response = await api.get<AdminQuestion[]>("/admin/questions");

  return response.data;
}

export type CategoryFormData = Pick<
  Category,
  "name" | "slug" | "description" | "isActive"
>;

export async function getAdminCategories() {
  const response = await api.get<Category[]>("/admin/categories");
  return response.data;
}

export async function createAdminCategory(data: CategoryFormData) {
  const response = await api.post<Category>("/admin/categories", data);
  return response.data;
}

export async function updateAdminCategory(id: string, data: CategoryFormData) {
  const response = await api.put<Category>(`/admin/categories/${id}`, data);

  return response.data;
}

export async function deleteAdminCategory(id: string) {
  await api.delete(`/admin/categories/${id}`);
}
