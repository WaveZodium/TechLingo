import type { QuizHistory } from "../../types/question";

type ProfileQuizHistoryProps = {
  quizHistory: QuizHistory[];
  getCategoryName: (categoryId: string) => string;
  formatDate: (date: string | null) => string;
  onStartQuiz: () => void;
};

function ProfileQuizHistory({
  quizHistory,
  getCategoryName,
  formatDate,
  onStartQuiz,
}: ProfileQuizHistoryProps) {
  return (
    <section className="profile-section">
      <div className="profile-section-header">
        <div>
          <span className="profile-label">Activity</span>

          <h2>Recent quizzes</h2>
        </div>

        <span className="profile-history-count">Last {quizHistory.length}</span>
      </div>

      {quizHistory.length === 0 ? (
        <div className="profile-empty">
          <p>No completed quizzes yet.</p>

          <button type="button" onClick={onStartQuiz}>
            Start a quiz →
          </button>
        </div>
      ) : (
        <div className="quiz-history-list">
          {quizHistory.map((quiz) => (
            <article className="quiz-history-item" key={quiz.sessionId}>
              <div className="quiz-history-info">
                <strong>{getCategoryName(quiz.categoryId)}</strong>

                <span>
                  {quiz.correctAnswers} / {quiz.totalQuestions} correct
                </span>
              </div>

              <div className="quiz-history-result">
                <strong
                  className={
                    quiz.quizScore >= 0
                      ? "quiz-history-score quiz-history-score--positive"
                      : "quiz-history-score quiz-history-score--negative"
                  }
                >
                  {quiz.quizScore > 0 ? "+" : ""}
                  {quiz.quizScore} pts
                </strong>

                <time>{formatDate(quiz.completedAt)}</time>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ProfileQuizHistory;
