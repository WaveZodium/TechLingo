import api from "./api";
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
} from "../types/auth";

export async function login(loginData: LoginRequest) {
  const response = await api.post<LoginResponse>("/auth/login", loginData);

  localStorage.setItem("token", response.data.token);

  return response.data;
}

export async function register(registerData: RegisterRequest) {
  const response = await api.post<RegisterResponse>(
    "/auth/register",
    registerData,
  );

  return response.data;
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function getToken(){
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
}

export function isAuthenticated() {
  return !!getToken();
}

