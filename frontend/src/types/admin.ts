import type { UserRole } from "../enums/userRole";

export type AdminUser = {
  id: string;
  username: string;
  role: UserRole;
};

export type AdminQuestion = {
  id: string;
  categoryId: string;
  message: string;
  prompt: string;
  isActive: boolean;
  createdAt: string;
};
