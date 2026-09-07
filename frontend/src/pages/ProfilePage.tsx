import { useNavigate } from "react-router-dom";

import { deleteAccount } from "../api/userApi";
import { useAuth } from "../context/AuthContext";

function ProfilePage() {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

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

      <button onClick={handleDeleteAccount}>Delete account</button>
    </main>
  );
}

export default ProfilePage;
