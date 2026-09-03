import { useState } from "react";
import "../styles/QuizPage.css";

const answers = [
  { letter: "A", text: "Be right back" },
  { letter: "B", text: "Be right back" },
  { letter: "C", text: "Be back right" },
  { letter: "D", text: "Right be back" },
];

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
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  return (
    <main className="quiz-page">
      <section className="quiz-shell" aria-labelledby="quiz-title">
        <h1 id="quiz-title" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
          TechLingo quiz
        </h1>

        <div className="conversation" aria-live="polite">
          <div className="message-row">
            <RobotAvatar />
            <div className="bubble robot">Ska ner till kebaben, BRB</div>
          </div>
          <div className="message-row">
            <RobotAvatar />
            <div className="bubble robot">Vad betyder BRB?</div>
          </div>
          {selectedAnswer && (
            <div className="message-row user">
              <div className="bubble user">{selectedAnswer}</div>
              <UserAvatar />
            </div>
          )}
        </div>

        <div className="divider" />

        <div className="answer-grid" role="group" aria-label="Välj ett svar">
          {answers.map((answer) => (
            <button
              className={`answer-button${selectedAnswer === answer.text ? " selected" : ""}`}
              key={answer.letter}
              onClick={() => setSelectedAnswer(answer.text)}
              type="button"
            >
              <span className="answer-letter">{answer.letter}</span>
              <span>{answer.text}</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

export default QuizPage;
