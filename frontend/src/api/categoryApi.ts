import api from "./api";

import type { Category } from "../types/category";

// Hämtar alla kategorier från backend.
export async function getCategories() {
  // Typningen anger att svaret ska innehålla en lista med Category-objekt.
  const response = await api.get<Category[]>("/Categories");

  // Returnerar endast datan från Axios-svaret.
  return response.data;
}
