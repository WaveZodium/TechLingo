export type AdminUser = {
  id: string;
  username: string;
  role: number;
};

export type AdminQuestion = {
  id: string;
  categoryId: string;
  message: string;
  prompt: string;
  isActive: boolean;
  createdAt: string;
};
