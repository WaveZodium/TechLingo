import api from "./api";
import type { LoginRequest, RegisterRequest } from "../types/auth";

export async function login(loginData: LoginRequest) {
  const response = await api.post("/auth/login", loginData);

  return response.data;
}

export async function register(registerData: RegisterRequest) {
  const response = await api.post("/auth/register", registerData);

  return response.data;
}
