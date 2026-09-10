import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { deleteAccount, getUserProfile } from "../api/userApi";
import { getQuizHistory } from "../api/quizApi";
import { getCategories } from "../api/categoryApi";

import { useAuth } from "../context/AuthContext";

import type { UserProfile } from "../types/user";
import type { QuizHistory } from "../types/question";

import "../styles/ProfilePage.css";

function ProfilePage() {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>([]);

  const [categoryNames, setCategoryNames] = useState<Map<string, string>>(
    new Map(),
  );

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        setError(null);

        const [userProfile, history, categories] = await Promise.all([
          getUserProfile(),
          getQuizHistory(),
          getCategories(),
        ]);

        setProfile(userProfile);
        setQuizHistory(history);

        setCategoryNames(
          new Map(categories.map((category) => [category.id, category.name])),
        );
      } catch (error) {
        console.error("Failed to load profile:", error);

        setError("Could not load profile.");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteAccount();

      logoutUser();

      navigate("/");
    } catch (error) {
      console.error("Failed to delete account:", error);

      setError("Could not delete account.");
    }
  }

  function getCategoryName(categoryId: string) {
    return categoryNames.get(categoryId) ?? "Quiz";
  }

  function formatDate(date: string | null) {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  if (isLoading) {
    return (
      <main className="profile-page">
        <p className="profile-status">Loading profile...</p>
      </main>
    );
  }

  if (error && !profile) {
    return (
      <main className="profile-page">
        <p className="profile-status profile-status--error">{error}</p>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <section className="profile-card">
        <div className="profile-user">
          <div className="profile-avatar" aria-hidden="true">
            {profile?.username?.charAt(0).toUpperCase() ?? "U"}
          </div>

          <div className="profile-user-info">
            <span className="profile-label">Profile</span>

            <h1>{profile?.username}</h1>

            <span className="profile-username">@{profile?.username}</span>
          </div>
        </div>

        <div className="profile-score">
          <span className="profile-label">Total score</span>

          <strong>{profile?.totalScore ?? 0}</strong>

          <span className="profile-score-unit">points</span>
        </div>
      </section>

      <section className="profile-section">
        <div className="profile-section-header">
          <div>
            <span className="profile-label">Activity</span>

            <h2>Recent quizzes</h2>
          </div>

          <span className="profile-history-count">
            Last {quizHistory.length}
          </span>
        </div>

        {quizHistory.length === 0 ? (
          <div className="profile-empty">
            <p>No completed quizzes yet.</p>

            <button type="button" onClick={() => navigate("/categories")}>
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

      <section className="profile-section profile-account profile-section--danger">
        <div>
          <span className="profile-label">Account</span>

          <h2>Account settings</h2>

          <p>
            Permanently delete your TechLingo account and all associated data.
          </p>
        </div>

        <button
          onClick={handleDeleteAccount}
          className="profile__delete-button"
          type="button"
        >
          Delete account
        </button>
      </section>

      {error && <p className="profile-status profile-status--error">{error}</p>}
    </main>
  );
}

export default ProfilePage;
