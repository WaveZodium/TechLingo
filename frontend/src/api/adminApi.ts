import api from "./api";

import type { Category } from "../types/category";

import type {
  AdminQuestion,
  AdminUser,
  CreateAdminUserData,
  QuestionFormData,
  UpdateAdminUserData,
} from "../types/admin";

// Users

export async function getAdminUsers() {
  const response = await api.get<AdminUser[]>("/admin/users");

  return response.data;
}

export async function createAdminUser(data: CreateAdminUserData) {
  const response = await api.post<AdminUser>("/admin/users", data);

  return response.data;
}

export async function updateAdminUser(id: string, data: UpdateAdminUserData) {
  const response = await api.put<AdminUser>(`/admin/users/${id}`, data);

  return response.data;
}

export async function deleteAdminUser(id: string) {
  await api.delete(`/admin/users/${id}`);
}

// Questions

export async function getAdminQuestions() {
  const response = await api.get<AdminQuestion[]>("/admin/questions");

  return response.data;
}

export async function createAdminQuestion(data: QuestionFormData) {
  const response = await api.post<AdminQuestion>("/admin/questions", data);

  return response.data;
}

export async function updateAdminQuestion(id: string, data: QuestionFormData) {
  const response = await api.put<AdminQuestion>(`/admin/questions/${id}`, data);

  return response.data;
}

export async function deleteAdminQuestion(id: string) {
  await api.delete(`/admin/questions/${id}`);
}

// Categories

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
