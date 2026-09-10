import "../styles/QuizPage.css";

import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getCategories } from "../api/categoryApi";
import { startQuiz, submitQuizAnswer, completeQuiz } from "../api/quizApi";

import QuizActions from "../components/quiz/QuizActions";
import QuizAnswerGrid from "../components/quiz/QuizAnswerGrid";
import QuizConversation from "../components/quiz/QuizConversation";
import QuizStats from "../components/quiz/QuizStats";
import { useQuiz } from "../context/QuizContext";
import { useUser } from "../context/UserContext";

import type { AnswerResult, Question, QuizResult } from "../types/question";
import type { ChatMessage } from "../types/quiz";

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

  const { loadProfile } = useUser();

  const { activeSessionId, startSession, finishSession, quitActiveSession } =
    useQuiz();

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

        if (
          startQuizCategoryRef.current !== categoryId ||
          !startQuizPromiseRef.current
        ) {
          startQuizCategoryRef.current = categoryId;
          startQuizPromiseRef.current = startQuiz(categoryId);
        }

        const quiz = await startQuizPromiseRef.current;

        if (!ignore) {
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

  useEffect(() => {
    if (!isLoading && questions.length > 0) {
      quizTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [isLoading, questions]);

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
    } catch (error) {
      console.error("Failed to submit answer:", error);
      setAnswerError("Could not check the answer.");
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

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

    if (isLastQuestion) {
      if (!activeSessionId) {
        return;
      }

      try {
        setIsCompletingQuiz(true);
        setAnswerError(null);

        const completedSessionId = activeSessionId;

        const result = await completeQuiz(completedSessionId);

        await finishSession();

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

        try {
          await loadProfile();
        } catch (profileError) {
          console.error(
            "Quiz completed, but failed to refresh user profile:",
            profileError,
          );
        }
      } catch (error) {
        console.error("Failed to complete quiz:", error);
        setAnswerError("Could not complete the quiz.");
      } finally {
        setIsCompletingQuiz(false);
      }

      return;
    }

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
      <QuizStats
        ref={quizTopRef}
        quizName={quizName}
        currentQuestionIndex={currentQuestionIndex}
        questionCount={questions.length}
        score={score}
      />

      <section className="quiz-shell" aria-labelledby="quiz-title">
        <h1 id="quiz-title" className="visually-hidden">
          TechLingo quiz
        </h1>

        <QuizConversation
          ref={conversationRef}
          chatMessages={chatMessages}
          answerError={answerError}
        />

        <div className="divider" />

        <QuizAnswerGrid
          currentQuestion={currentQuestion}
          selectedAnswerId={selectedAnswerId}
          answerResult={answerResult}
          quizResult={quizResult}
          isSubmittingAnswer={isSubmittingAnswer}
          isQuittingQuiz={isQuittingQuiz}
          onAnswerClick={handleAnswerClick}
        />

        <QuizActions
          quizResult={quizResult}
          answerResult={answerResult}
          isQuittingQuiz={isQuittingQuiz}
          isCompletingQuiz={isCompletingQuiz}
          isSubmittingAnswer={isSubmittingAnswer}
          isLastQuestion={isLastQuestion}
          onQuit={handleQuitQuiz}
          onNext={handleNextQuestion}
          onBackToCategories={() => navigate("/categories")}
        />
      </section>
    </main>
  );
}

export default QuizPage;
