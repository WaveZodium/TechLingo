import type { AnswerResult, Question, QuizResult } from "../../types/question";

type QuizAnswerGridProps = {
  currentQuestion: Question;
  selectedAnswerId: string | null;
  answerResult: AnswerResult | null;
  quizResult: QuizResult | null;
  isSubmittingAnswer: boolean;
  isQuittingQuiz: boolean;
  onAnswerClick: (answerId: string) => void;
};

function QuizAnswerGrid({
  currentQuestion,
  selectedAnswerId,
  answerResult,
  quizResult,
  isSubmittingAnswer,
  isQuittingQuiz,
  onAnswerClick,
}: QuizAnswerGridProps) {
  return (
    <div className="answer-grid" role="group" aria-label="Choose an answer">
      {currentQuestion.options.map((answer, index) => (
        <button
          className={`answer-button${
            selectedAnswerId === answer.id ? " selected" : ""
          }${answerResult?.correctAnswerId === answer.id ? " correct" : ""}${
            answerResult &&
            !answerResult.isCorrect &&
            selectedAnswerId === answer.id
              ? " incorrect"
              : ""
          }`}
          key={answer.id}
          onClick={() => onAnswerClick(answer.id)}
          type="button"
          disabled={
            isSubmittingAnswer ||
            answerResult !== null ||
            quizResult !== null ||
            isQuittingQuiz
          }
        >
          <span className="answer-letter">
            {String.fromCharCode(65 + index)}
          </span>

          <span>{answer.text}</span>
        </button>
      ))}
    </div>
  );
}

export default QuizAnswerGrid;
