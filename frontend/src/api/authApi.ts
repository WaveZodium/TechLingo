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

export function getToken() {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
}

export function isAuthenticated() {
  return !!getToken();
}

//Returnera utgångstiden för en JWT-token i millisekunder, eller null om den inte kan bestämmas.
export function getTokenExpiration(token: string) {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");

    const decodedPayload = JSON.parse(atob(base64));

    if (!decodedPayload.exp) {
      return null;
    }

    return decodedPayload.exp * 1000;
  } catch {
    return null;
  }
}
