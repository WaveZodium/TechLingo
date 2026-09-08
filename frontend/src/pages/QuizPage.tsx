import "../styles/QuizPage.css";

import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import { getCategories } from "../api/categoryApi";
import { startQuiz, submitQuizAnswer, completeQuiz } from "../api/quizApi";

import type { AnswerResult, Question, QuizResult } from "../types/question";

function RobotAvatar() {
  return (
    <span className="robot-avatar" aria-hidden="true">
      <span className="robot-antenna" />

      <span className="robot-face">
        <span className="robot-eye robot-eye-left" />
        <span className="robot-eye robot-eye-right" />
        <span className="robot-mouth" />
      </span>
    </span>
  );
}

function UserAvatar() {
  return (
    <span className="user-avatar" aria-hidden="true">
      <span className="user-head" />
      <span className="user-shoulders" />
    </span>
  );
}

function QuizPage() {
  const { categoryId } = useParams();

  const [questions, setQuestions] = useState<Question[]>([]);

  const [quizName, setQuizName] = useState("Quiz");

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);

  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  const [answerError, setAnswerError] = useState<string | null>(null);

  const [score, setScore] = useState(0);

  const [sessionId, setSessionId] = useState<string | null>(null);

  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const [isCompletingQuiz, setIsCompletingQuiz] = useState(false);

  const startQuizPromiseRef = useRef<ReturnType<typeof startQuiz> | null>(null);
  const startQuizCategoryRef = useRef<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadQuestions() {
      if (!categoryId) {
        setError("No category was selected.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        setQuestions([]);
        setQuizName("Quiz");

        setCurrentQuestionIndex(0);
        setSelectedAnswerId(null);
        setAnswerResult(null);
        setAnswerError(null);

        setIsSubmittingAnswer(false);
        setIsCompletingQuiz(false);

        setScore(0);
        setSessionId(null);
        setQuizResult(null);

        //för att inte start 2 quiz (strict mode)
        if (
          startQuizCategoryRef.current !== categoryId ||
          !startQuizPromiseRef.current
        ) {
          startQuizCategoryRef.current = categoryId;
          startQuizPromiseRef.current = startQuiz(categoryId);
        }

        const quiz = await startQuizPromiseRef.current;

        if (!ignore) {
          setSessionId(quiz.sessionId);
          setQuestions(quiz.questions);
        }

        try {
          const categories = await getCategories();

          const category = categories.find((item) => item.id === categoryId);

          if (!ignore && category) {
            setQuizName(category.name);
          }
        } catch (categoryError) {
          console.error("Failed to load quiz name:", categoryError);
        }
      } catch (error) {
        if (!ignore) {
          console.error("Failed to start quiz:", error);

          setError("Could not load questions.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadQuestions();

    return () => {
      ignore = true;
    };
  }, [categoryId]);

  if (isLoading) {
    return (
      <main className="quiz-page">
        <section className="quiz-shell">
          <p className="quiz-status">Loading questions...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="quiz-page">
        <section className="quiz-shell">
          <p className="quiz-status">{error}</p>
        </section>
      </main>
    );
  }

  if (questions.length === 0) {
    return (
      <main className="quiz-page">
        <section className="quiz-shell">
          <p className="quiz-status">No questions found for this category.</p>
        </section>
      </main>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const selectedAnswer = currentQuestion.options.find(
    (option) => option.id === selectedAnswerId,
  );

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerClick = async (answerId: string) => {
    if (isSubmittingAnswer || answerResult || quizResult || !sessionId) {
      return;
    }

    setSelectedAnswerId(answerId);
    setAnswerResult(null);
    setAnswerError(null);
    setIsSubmittingAnswer(true);

    try {
      const result = await submitQuizAnswer(sessionId, {
        questionId: currentQuestion.id,
        answerId,
      });

      setAnswerResult(result);

      setScore((currentScore) => currentScore + result.points);
    } catch (error) {
      console.error("Failed to submit answer:", error);

      setAnswerError("Could not check the answer.");
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const handleNextQuestion = async () => {
    if (!answerResult || isCompletingQuiz) {
      return;
    }

    if (isLastQuestion) {
      if (!sessionId) {
        return;
      }

      try {
        setIsCompletingQuiz(true);
        setAnswerError(null);

        const result = await completeQuiz(sessionId);

        setQuizResult(result);

        setScore(result.quizScore);
      } catch (error) {
        console.error("Failed to complete quiz:", error);

        setAnswerError("Could not complete the quiz.");
      } finally {
        setIsCompletingQuiz(false);
      }

      return;
    }

    setCurrentQuestionIndex((currentIndex) => currentIndex + 1);

    setSelectedAnswerId(null);
    setAnswerResult(null);
    setAnswerError(null);
  };

  return (
    <main className="quiz-page">
      <div className="quiz-placeholder">
        <div className="quiz-stat quiz-stat--name">
          <span className="quiz-stat-label">Quiz</span>

          <strong>{quizName}</strong>
        </div>

        <div aria-hidden="true" />

        <div className="quiz-stat-group">
          <div className="quiz-stat quiz-stat--question">
            <span className="quiz-stat-label">Question</span>

            <strong>
              {currentQuestionIndex + 1} / {questions.length}
            </strong>
          </div>

          <div className="quiz-stat quiz-stat--score">
            <span className="quiz-stat-label">Score</span>

            <strong>{score}</strong>
          </div>
        </div>
      </div>

      <section className="quiz-shell" aria-labelledby="quiz-title">
        <h1 id="quiz-title" className="visually-hidden">
          TechLingo quiz
        </h1>

        <div className="conversation" aria-live="polite">
          <div className="message-row message-row--robot">
            <RobotAvatar />

            <div className="message-content">
              <span className="message-sender">TechLingo</span>

              <div className="bubble bubble--robot">
                {currentQuestion.message}
              </div>
            </div>
          </div>

          <div className="message-row message-row--robot">
            <RobotAvatar />

            <div className="message-content">
              <span className="message-sender">TechLingo</span>

              <div className="bubble bubble--robot">
                {currentQuestion.prompt}
              </div>
            </div>
          </div>

          {selectedAnswer && (
            <div className="message-row message-row--user">
              <div className="message-content message-content--user">
                <span className="message-sender message-sender--user">You</span>

                <div className="bubble bubble--user">{selectedAnswer.text}</div>
              </div>

              <UserAvatar />
            </div>
          )}

          {answerResult && (
            <div className="message-row message-row--robot">
              <RobotAvatar />

              <div className="message-content">
                <span className="message-sender">TechLingo</span>

                <div className="bubble bubble--robot">
                  {answerResult.isCorrect ? (
                    <>
                      Correct! You got{" "}
                      <span className="points">{answerResult.points}</span>{" "}
                      points.
                    </>
                  ) : (
                    <>
                      Not quite. The correct answer is "
                      {answerResult.correctAnswer}
                      ".
                      <br />
                      You got{" "}
                      <span className="points wrong">
                        {answerResult.points}
                      </span>{" "}
                      points.
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {quizResult && (
            <div className="message-row message-row--robot">
              <RobotAvatar />

              <div className="message-content">
                <span className="message-sender">TechLingo</span>

                <div className="bubble bubble--robot">
                  Quiz complete!
                  <br />
                  Quiz score: {quizResult.quizScore}
                  <br />
                  Total score: {quizResult.totalScore}
                </div>
              </div>
            </div>
          )}

          {answerError && (
            <div className="message-row message-row--robot">
              <RobotAvatar />

              <div className="message-content">
                <span className="message-sender">TechLingo</span>

                <div className="bubble bubble--robot">{answerError}</div>
              </div>
            </div>
          )}
        </div>

        <div className="divider" />

        <div className="answer-grid" role="group" aria-label="Choose an answer">
          {currentQuestion.options.map((answer, index) => (
            <button
              className={`answer-button${
                selectedAnswerId === answer.id ? " selected" : ""
              }${
                answerResult?.correctAnswerId === answer.id ? " correct" : ""
              }${
                answerResult &&
                !answerResult.isCorrect &&
                selectedAnswerId === answer.id
                  ? " incorrect"
                  : ""
              }`}
              key={answer.id}
              onClick={() => handleAnswerClick(answer.id)}
              type="button"
              disabled={
                isSubmittingAnswer ||
                answerResult !== null ||
                quizResult !== null
              }
            >
              <span className="answer-letter">
                {String.fromCharCode(65 + index)}
              </span>

              <span>{answer.text}</span>
            </button>
          ))}
        </div>

        {answerResult && !quizResult && (
          <div className="quiz-actions">
            <button
              className="quiz-next-button"
              type="button"
              onClick={handleNextQuestion}
              disabled={isCompletingQuiz}
            >
              {isCompletingQuiz
                ? "Finishing..."
                : isLastQuestion
                  ? "Finish quiz"
                  : "Next question →"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default QuizPage;
