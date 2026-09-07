import "../styles/QuizPage.css";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getQuestionsByCategory } from "../api/questionApi";
import type { Question } from "../types/question";

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
  // Hämtar kategori-id från URL:en.
  const { categoryId } = useParams();

  // Sparar frågorna som hämtas från backend.
  const [questions, setQuestions] = useState<Question[]>([]);

  const [currentQuestionIndex /* setCurrentQuestionIndex */] = useState(0);

  // Håller reda på vilket svar användaren har valt.
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);

  // Hanterar laddningsstatus och eventuella fel.
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hämtar frågor när categoryId ändras.
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
        setSelectedAnswerId(null);

        const data = await getQuestionsByCategory(categoryId);

        if (!ignore) {
          setQuestions(data);
        }
      } catch (error) {
        if (!ignore) {
          console.error("Failed to load questions:", error);
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

  // Loading
  if (isLoading) {
    return (
      <main className="quiz-page">
        <section className="quiz-shell">
          <p className="quiz-status">Loading questions...</p>
        </section>
      </main>
    );
  }

  // Fel
  if (error) {
    return (
      <main className="quiz-page">
        <section className="quiz-shell">
          <p className="quiz-status">{error}</p>
        </section>
      </main>
    );
  }

  // Inga frågor
  if (questions.length === 0) {
    return (
      <main className="quiz-page">
        <section className="quiz-shell">
          <p className="quiz-status">No questions found for this category.</p>
        </section>
      </main>
    );
  }

  // Frågan som visas just nu.
  const currentQuestion = questions[currentQuestionIndex];

  // Hittar användarens valda svar.
  const selectedAnswer = currentQuestion.options.find(
    (option) => option.id === selectedAnswerId,
  );

  return (
    <main className="quiz-page">
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
        </div>

        <div className="divider" />

        <div className="answer-grid" role="group" aria-label="Choose an answer">
          {currentQuestion.options.map((answer, index) => (
            <button
              className={`answer-button${
                selectedAnswerId === answer.id ? " selected" : ""
              }`}
              key={answer.id}
              onClick={() => setSelectedAnswerId(answer.id)}
              type="button"
            >
              <span className="answer-letter">
                {String.fromCharCode(65 + index)}
              </span>

              <span>{answer.text}</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

export default QuizPage;
