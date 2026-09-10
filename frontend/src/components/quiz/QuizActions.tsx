import type { AnswerResult, QuizResult } from "../../types/question";

type QuizActionsProps = {
  quizResult: QuizResult | null;
  answerResult: AnswerResult | null;
  isQuittingQuiz: boolean;
  isCompletingQuiz: boolean;
  isSubmittingAnswer: boolean;
  isLastQuestion: boolean;
  onQuit: () => void;
  onNext: () => void;
  onBackToCategories: () => void;
};

function QuizActions({
  quizResult,
  answerResult,
  isQuittingQuiz,
  isCompletingQuiz,
  isSubmittingAnswer,
  isLastQuestion,
  onQuit,
  onNext,
  onBackToCategories,
}: QuizActionsProps) {
  return (
    <div className="quiz-actions">
      {!quizResult ? (
        <>
          <button
            className="quiz-quit-button"
            type="button"
            onClick={onQuit}
            disabled={isQuittingQuiz || isCompletingQuiz || isSubmittingAnswer}
          >
            {isQuittingQuiz ? "Quitting..." : "← Quit quiz"}
          </button>

          <button
            className="quiz-next-button"
            type="button"
            onClick={onNext}
            disabled={!answerResult || isCompletingQuiz || isQuittingQuiz}
          >
            {isCompletingQuiz
              ? "Finishing..."
              : isLastQuestion
                ? "Finish quiz"
                : "Next question →"}
          </button>
        </>
      ) : (
        <>
          <div />

          <button
            className="quiz-next-button"
            type="button"
            onClick={onBackToCategories}
          >
            Back to categories →
          </button>
        </>
      )}
    </div>
  );
}

export default QuizActions;
