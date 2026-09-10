import "../styles/QuizPage.css";

import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getCategories } from "../api/categoryApi";
import { startQuiz, submitQuizAnswer, completeQuiz } from "../api/quizApi";

import { useUser } from "../context/UserContext";
import { useQuiz } from "../context/QuizContext";

import type { AnswerResult, Question, QuizResult } from "../types/question";

type ChatMessage =
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

function createQuestionMessages(question: Question): ChatMessage[] {
  return [
    {
      id: `${question.id}-message`,
      sender: "robot",
      type: "text",
      text: question.message,
    },
    {
      id: `${question.id}-prompt`,
      sender: "robot",
      type: "text",
      text: question.prompt,
    },
  ];
}

function QuizPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const { activeSessionId, startSession, finishSession, quitActiveSession } =
    useQuiz();

  const { updateTotalScore } = useUser();

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

  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const [isCompletingQuiz, setIsCompletingQuiz] = useState(false);

  const [isQuittingQuiz, setIsQuittingQuiz] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const startQuizPromiseRef = useRef<ReturnType<typeof startQuiz> | null>(null);

  const startQuizCategoryRef = useRef<string | null>(null);

  const conversationRef = useRef<HTMLDivElement | null>(null);

  const quizTopRef = useRef<HTMLDivElement | null>(null);
  const { loadProfile } = useUser();

  /*
   * Startar quizet och laddar frågorna.
   */
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
        setIsQuittingQuiz(false);

        setScore(0);
        setQuizResult(null);

        setChatMessages([]);

        /*
         * Förhindrar dubbla startQuiz-anrop
         * från React StrictMode.
         */
        if (
          startQuizCategoryRef.current !== categoryId ||
          !startQuizPromiseRef.current
        ) {
          startQuizCategoryRef.current = categoryId;

          startQuizPromiseRef.current = startQuiz(categoryId);
        }

        const quiz = await startQuizPromiseRef.current;

        if (!ignore) {
          /*
           * QuizContext äger nu den
           * aktiva sessionen.
           */
          startSession(quiz.sessionId);

          setQuestions(quiz.questions);

          const firstQuestion = quiz.questions[0];

          if (firstQuestion) {
            setChatMessages(createQuestionMessages(firstQuestion));
          }
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
  }, [categoryId, startSession]);

  /*
   * Scrollar webbsidan till toppen
   * av quizet när frågorna laddat klart.
   */
  useEffect(() => {
    if (!isLoading && questions.length > 0) {
      quizTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [isLoading, questions]);

  /*
   * Scrollar inne i chatten när
   * ett nytt meddelande visas.
   */
  useEffect(() => {
    const conversation = conversationRef.current;

    if (!conversation) {
      return;
    }

    conversation.scrollTo({
      top: conversation.scrollHeight,
      behavior: "smooth",
    });
  }, [chatMessages, answerError]);

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

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerClick = async (answerId: string) => {
    if (isSubmittingAnswer || answerResult || quizResult || !activeSessionId) {
      return;
    }

    setSelectedAnswerId(answerId);

    setAnswerResult(null);
    setAnswerError(null);

    setIsSubmittingAnswer(true);

    try {
      const result = await submitQuizAnswer(activeSessionId, {
        questionId: currentQuestion.id,
        answerId,
      });

      const selectedAnswer = currentQuestion.options.find(
        (option) => option.id === answerId,
      );

      if (!selectedAnswer) {
        return;
      }

      setChatMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `${currentQuestion.id}-answer`,
          sender: "user",
          type: "text",
          text: selectedAnswer.text,
        },
        {
          id: `${currentQuestion.id}-feedback`,
          sender: "robot",
          type: "feedback",
          result,
        },
      ]);

      setAnswerResult(result);

      setScore((currentScore) => currentScore + result.points);

      /*
       * Uppdaterar navbarens score
       * visuellt medan quizet pågår.
       */
      updateTotalScore(result.points);
    } catch (error) {
      console.error("Failed to submit answer:", error);

      setAnswerError("Could not check the answer.");
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  /*
   * Quizets egna Quit-knapp.
   */
  const handleQuitQuiz = async () => {
    if (!activeSessionId || isQuittingQuiz) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to quit? Your quiz progress will be lost.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsQuittingQuiz(true);

      setAnswerError(null);

      /*
       * QuizContext:
       * - DELETE session
       * - activeSessionId = null
       * - loadProfile()
       */
      await quitActiveSession();

      navigate("/categories");
    } catch (error) {
      console.error("Failed to quit quiz:", error);

      setAnswerError("Could not quit the quiz.");
    } finally {
      setIsQuittingQuiz(false);
    }
  };

  const handleNextQuestion = async () => {
    if (!answerResult || isCompletingQuiz) {
      return;
    }

    /*
     * Fråga 10:
     * avsluta quizet.
     */
    if (isLastQuestion) {
      if (!activeSessionId) {
        return;
      }

      try {
        setIsCompletingQuiz(true);

        setAnswerError(null);

        /*
         * Spara ID:t innan finishSession()
         * sätter activeSessionId till null.
         */
        const completedSessionId = activeSessionId;

        const result = await completeQuiz(completedSessionId);

        /*
         * Quizet är nu färdigt i
         * backend och ska inte längre
         * betraktas som en aktiv session.
         */
        finishSession();

        setQuizResult(result);

        setScore(result.quizScore);

        setChatMessages((currentMessages) => [
          ...currentMessages,
          {
            id: `${completedSessionId}-result`,
            sender: "robot",
            type: "result",
            result,
          },
        ]);
      } catch (error) {
        console.error("Failed to complete quiz:", error);

        setAnswerError("Could not complete the quiz.");
      } finally {
        setIsCompletingQuiz(false);
      }

      return;
    }

    /*
     * Fråga 1–9:
     * gå vidare.
     */
    const nextQuestionIndex = currentQuestionIndex + 1;

    const nextQuestion = questions[nextQuestionIndex];

    if (!nextQuestion) {
      return;
    }

    setChatMessages((currentMessages) => [
      ...currentMessages,
      ...createQuestionMessages(nextQuestion),
    ]);

    setCurrentQuestionIndex(nextQuestionIndex);

    setSelectedAnswerId(null);

    setAnswerResult(null);
    setAnswerError(null);
  };

  return (
    <main className="quiz-page">
      <div className="quiz-placeholder" ref={quizTopRef}>
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

        <div ref={conversationRef} className="conversation" aria-live="polite">
          {chatMessages.map((message) => {
            if (message.sender === "user") {
              return (
                <div key={message.id} className="message-row message-row--user">
                  <div className="message-content message-content--user">
                    <span className="message-sender message-sender--user">
                      You
                    </span>

                    <div className="bubble bubble--user">{message.text}</div>
                  </div>

                  <UserAvatar />
                </div>
              );
            }

            return (
              <div key={message.id} className="message-row message-row--robot">
                <RobotAvatar />

                <div className="message-content">
                  <span className="message-sender">TechLingo</span>

                  <div className="bubble bubble--robot">
                    {message.type === "text" && message.text}

                    {message.type === "feedback" &&
                      (message.result.isCorrect ? (
                        <>
                          Correct! You got{" "}
                          <span className="points">
                            {message.result.points}
                          </span>{" "}
                          points.
                        </>
                      ) : (
                        <>
                          Not quite. The correct answer is "
                          {message.result.correctAnswer}
                          ".
                          <br />
                          You got{" "}
                          <span className="points wrong">
                            {message.result.points}
                          </span>{" "}
                          points.
                        </>
                      ))}

                    {message.type === "result" && (
                      <>
                        Quiz complete!
                        <br />
                        Quiz score: {message.result.quizScore}
                        <br />
                        Total score: {message.result.totalScore}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

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

        <div className="quiz-actions">
          {!quizResult ? (
            <>
              <button
                className="quiz-quit-button"
                type="button"
                onClick={handleQuitQuiz}
                disabled={
                  isQuittingQuiz || isCompletingQuiz || isSubmittingAnswer
                }
              >
                {isQuittingQuiz ? "Quitting..." : "← Quit quiz"}
              </button>

              <button
                className="quiz-next-button"
                type="button"
                onClick={handleNextQuestion}
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
                onClick={() => navigate("/categories")}
              >
                Back to categories →
              </button>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default QuizPage;
