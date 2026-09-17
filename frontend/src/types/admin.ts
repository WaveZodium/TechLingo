import type { UserRole } from "../enums/userRole";

export type AdminUser = {
  id: string;
  username: string;
  role: UserRole;
};

export type AdminAnswerOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type AdminQuestion = {
  id: string;
  categoryId: string;
  message: string;
  prompt: string;
  options: AdminAnswerOption[];
  explanation: string | null;
  isActive: boolean;
  createdAt: string;
};

export type QuestionFormData = {
  categoryId: string;
  message: string;
  prompt: string;
  options: AdminAnswerOption[];
  explanation: string | null;
  isActive: boolean;
};

export type CreateAdminUserData = {
  username: string;
  password: string;
  role: UserRole;
};

export type UpdateAdminUserData = {
  username: string;
  role: UserRole;
};
