import api from "./api";

import type { CompleteQuizRequest, QuizResult } from "../types/question";

export async function completeQuiz(
  request: CompleteQuizRequest,
): Promise<QuizResult> {
  const response = await api.post<QuizResult>("/Quiz/complete", request);

  return response.data;
}
