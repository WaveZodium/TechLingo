import api from "./api";
import type { Question } from "../types/question";

// Hämtar alla frågor som tillhör en specifik kategori.
export async function getQuestionsByCategory(categoryId: string) {
  // Skickar kategori-id i URL:en och förväntar en lista med Question-objekt.
  const response = await api.get<Question[]>(
    `/Categories/${categoryId}/questions`,
  );

  // Returnerar endast datan från Axios-svaret.
  return response.data;
}
