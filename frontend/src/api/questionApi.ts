import api from "./api";
import type {
  AnswerResult,
  Question,
  SubmitAnswerRequest,
} from "../types/question";

// Hämtar alla frågor som tillhör en specifik kategori.
export async function getQuestionsByCategory(categoryId: string) {
  // Skickar kategori-id i URL:en och förväntar en lista med Question-objekt.
  const response = await api.get<Question[]>(
    `/Categories/${categoryId}/questions`,
  );

  // Returnerar endast datan från Axios-svaret.
  return response.data;
}

// Skickar ett svar på en fråga till servern och returnerar resultatet.
export async function submitAnswer(request: SubmitAnswerRequest): Promise<AnswerResult> {
  const response = await api.post<AnswerResult>(
    "/Questions/question/answer",
    request,
  );

  return response.data;
}