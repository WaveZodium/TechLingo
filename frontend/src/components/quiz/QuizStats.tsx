import { forwardRef } from "react";

type QuizStatsProps = {
  quizName: string;
  currentQuestionIndex: number;
  questionCount: number;
  score: number;
};

const QuizStats = forwardRef<HTMLDivElement, QuizStatsProps>(
  ({ quizName, currentQuestionIndex, questionCount, score }, ref) => {
    return (
      <div className="quiz-placeholder" ref={ref}>
        <div className="quiz-stat quiz-stat--name">
          <span className="quiz-stat-label">Quiz</span>

          <strong>{quizName}</strong>
        </div>

        <div aria-hidden="true" />

        <div className="quiz-stat-group">
          <div className="quiz-stat quiz-stat--question">
            <span className="quiz-stat-label">Question</span>

            <strong>
              {currentQuestionIndex + 1} / {questionCount}
            </strong>
          </div>

          <div className="quiz-stat quiz-stat--score">
            <span className="quiz-stat-label">Score</span>

            <strong>{score}</strong>
          </div>
        </div>
      </div>
    );
  },
);

export default QuizStats;
