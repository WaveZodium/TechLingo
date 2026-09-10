import api from "./api";
import type { LeaderboardUser, UserProfile } from "../types/user";

export async function getUserProfile() {
  const response = await api.get<UserProfile>("/user/account");

  return response.data;
}

export async function deleteAccount() {
  await api.delete("/user/account");
}

export async function getLeaderboard() {
  const response = await api.get<LeaderboardUser[]>("/user/leaderboard");

  return response.data;
}
