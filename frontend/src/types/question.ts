export interface AnswerOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  categoryId: string;
  message: string;
  prompt: string;
  options: AnswerOption[];
}

export interface AnswerResult {
  isCorrect: boolean;
  points: number;
  correctAnswer: string | null;
  correctAnswerId: string | null;
  errorMessage: string | null;
}

export interface SubmitAnswerRequest {
  questionId: string;
  answerId: string;
}
export interface StartQuizResult {
  sessionId: string;
  questions: Question[];
}

export interface QuizResult {
  quizScore: number;
  totalScore: number;
}
