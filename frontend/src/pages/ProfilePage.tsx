import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteAccount, getUserProfile } from "../api/userApi";
import { useAuth } from "../context/AuthContext";
import type { UserProfile } from "../types/user";
import "../styles/ProfilePage.css";

function ProfilePage() {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const userProfile = await getUserProfile();

      setProfile(userProfile);
    }

    loadProfile();
  }, []);

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account?",
    );

    if (!confirmed) {
      return;
    }

    await deleteAccount();

    logoutUser();
    navigate("/");
  }

  return (
    <main>
      <h1>Profile</h1>

      <p>Username: {profile?.username}</p>
      <button
        onClick={handleDeleteAccount}
        className="profile__delete-button"
        type="button"
      >
        Delete account
      </button>
    </main>
  );
}

export default ProfilePage;
