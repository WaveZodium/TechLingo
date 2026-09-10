import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCategories } from "../api/categoryApi";
import { getQuizHistory } from "../api/quizApi";
import { deleteAccount, getUserProfile } from "../api/userApi";

import ProfileAccountSettings from "../components/profile/ProfileAccountSettings";
import ProfileQuizHistory from "../components/profile/ProfileQuizHistory";
import ProfileSummaryCard from "../components/profile/ProfileSummaryCard";
import { useAuth } from "../context/AuthContext";

import type { QuizHistory } from "../types/question";
import type { UserProfile } from "../types/user";

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
      <ProfileSummaryCard profile={profile} />

      <ProfileQuizHistory
        quizHistory={quizHistory}
        getCategoryName={getCategoryName}
        formatDate={formatDate}
        onStartQuiz={() => navigate("/categories")}
      />

      <ProfileAccountSettings onDeleteAccount={handleDeleteAccount} />

      {error && <p className="profile-status profile-status--error">{error}</p>}
    </main>
  );
}

export default ProfilePage;
