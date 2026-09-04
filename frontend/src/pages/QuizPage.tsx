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
  // Hämtar kategori-id från URL:en för att veta vilken kategoris frågor som ska visas.
  const { categoryId } = useParams();

  // Sparar frågorna som hämtas från backend.
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex /* setCurrentQuestionIndex */] = useState(0); // aktivera när navigering mellan frågor implementeras

  // Håller reda på vilket svar användaren har valt.
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);

  // Hanterar laddningsstatus och eventuella fel vid hämtning.
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hämtar frågor på nytt när categoryId ändras.
  useEffect(() => {
    async function loadQuestions() {
      if (!categoryId) {
        setError("No category was selected.");
        setIsLoading(false);
        return;
      }

      try {
        // Hämtar alla frågor som tillhör den valda kategorin.
        const data = await getQuestionsByCategory(categoryId);

        setQuestions(data);
      } catch (error) {
        console.error("Failed to load questions:", error);
        setError("Could not load questions.");
      } finally {
        setIsLoading(false);
      }
    }

    loadQuestions();
  }, [categoryId]);

  // Loading visas medan frågorna hämtas från backend.
  if (isLoading) {
    return (
      <main className="quiz-page">
        <section className="quiz-shell">
          <p>Loading questions...</p>
        </section>
      </main>
    );
  }

  // kastar felmeddelande om hämtningen av frågor misslyckas.
  if (error) {
    return (
      <main className="quiz-page">
        <section className="quiz-shell">
          <p>{error}</p>
        </section>
      </main>
    );
  }

  // Hanterar fallet där kategorin inte innehåller några frågor.
  if (questions.length === 0) {
    return (
      <main className="quiz-page">
        <section className="quiz-shell">
          <p>No questions found for this category.</p>
        </section>
      </main>
    );
  }

  // Hämtar den fråga som ska visas just nu.
  const currentQuestion = questions[currentQuestionIndex];

  // Letar upp hela svarsalternativet utifrån det valda svarets id.
  const selectedAnswer = currentQuestion.options.find(
    (option) => option.id === selectedAnswerId,
  );

  return (
    <main className="quiz-page">
      <section className="quiz-shell" aria-labelledby="quiz-title">
        <h1
          id="quiz-title"
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            overflow: "hidden",
            clip: "rect(0 0 0 0)",
          }}
        >
          TechLingo quiz
        </h1>

        <div className="conversation" aria-live="polite">
          <div className="message-row">
            <RobotAvatar />

            <div className="bubble robot">{currentQuestion.message}</div>
          </div>

          <div className="message-row">
            <RobotAvatar />

            <div className="bubble robot">{currentQuestion.prompt}</div>
          </div>

          {/* Visar användarens valda svar i chatten. */}
          {selectedAnswer && (
            <div className="message-row user">
              <div className="bubble user">{selectedAnswer.text}</div>

              <UserAvatar />
            </div>
          )}
        </div>

        <div className="divider" />

        <div className="answer-grid" role="group" aria-label="Välj ett svar">
          {/* Skapar en knapp för varje svarsalternativ som kommer från backend. */}
          {currentQuestion.options.map((answer, index) => (
            <button
              className={`answer-button${
                selectedAnswerId === answer.id ? " selected" : ""
              }`}
              key={answer.id}
              onClick={() => setSelectedAnswerId(answer.id)}
              type="button"
            >
              {/* Omvandlar index 0, 1, 2, 3 till bokstäverna A, B, C, D. */}
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
