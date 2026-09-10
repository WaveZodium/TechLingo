import { forwardRef } from "react";

import type { ChatMessage } from "../../types/quiz";
import { RobotAvatar, UserAvatar } from "./QuizAvatar";

type QuizConversationProps = {
  chatMessages: ChatMessage[];
  answerError: string | null;
};

const QuizConversation = forwardRef<HTMLDivElement, QuizConversationProps>(
  ({ chatMessages, answerError }, ref) => {
    return (
      <div ref={ref} className="conversation" aria-live="polite">
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
                        <span className="points">{message.result.points}</span>{" "}
                        points.
                      </>
                    ) : (
                      <>
                        Not quite. The correct answer is "
                        {message.result.correctAnswer}".
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
    );
  },
);

export default QuizConversation;
