import api from "./api";

import type {
  AnswerResult,
  QuizResult,
  StartQuizResult,
  SubmitAnswerRequest,
} from "../types/question";

export async function startQuiz(categoryId: string): Promise<StartQuizResult> {
  const response = await api.post<StartQuizResult>(`/Quiz/start/${categoryId}`);

  return response.data;
}

export async function submitQuizAnswer(
  sessionId: string,
  request: SubmitAnswerRequest,
): Promise<AnswerResult> {
  const response = await api.post<AnswerResult>(
    `/Quiz/${sessionId}/answer`,
    request,
  );

  return response.data;
}

export async function completeQuiz(sessionId: string): Promise<QuizResult> {
  const response = await api.post<QuizResult>(`/Quiz/${sessionId}/complete`);

  return response.data;
}
