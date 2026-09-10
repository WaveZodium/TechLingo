import type { AnswerResult, QuizResult } from "./question";

export type ChatMessage =
  | {
      id: string;
      sender: "robot" | "user";
      type: "text";
      text: string;
    }
  | {
      id: string;
      sender: "robot";
      type: "feedback";
      result: AnswerResult;
    }
  | {
      id: string;
      sender: "robot";
      type: "result";
      result: QuizResult;
    };
