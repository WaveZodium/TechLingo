import api from "./api";

import type {
  AnswerResult,
  QuizResult,
  StartQuizResult,
  SubmitAnswerRequest,
  QuizHistory,
} from "../types/question";
// starta ett nytt quiz
export async function startQuiz(categoryId: string): Promise<StartQuizResult> {
  const response = await api.post<StartQuizResult>(`/Quiz/start/${categoryId}`);

  return response.data;
}
// skicka svar på en fråga
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
// avsluta quiz och hämta resultatet
export async function completeQuiz(sessionId: string): Promise<QuizResult> {
  const response = await api.post<QuizResult>(`/Quiz/${sessionId}/complete`);

  return response.data;
}
//avsluta quiz
export async function quitQuiz(sessionId: string): Promise<void> {
  await api.delete(`/Quiz/${sessionId}`);
}
// hämta quizhistorik
export async function getQuizHistory(): Promise<QuizHistory[]> {
  const response = await api.get<QuizHistory[]>(`/Quiz/history`);

  return response.data;
}
