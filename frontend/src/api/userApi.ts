import api from "./api";
import type { UserProfile } from "../types/user";

export async function getUserProfile() {
  const response = await api.get<UserProfile>("/user/account");

  return response.data;
}

export async function deleteAccount() {
  await api.delete("/user/account");
}
