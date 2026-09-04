import axios from "axios";

const useHttps = false; // Set to true if you want to use HTTPS, false for HTTP

const API_URL = useHttps
  ? import.meta.env.VITE_API_URL_HTTPS
  : import.meta.env.VITE_API_URL_HTTP;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
