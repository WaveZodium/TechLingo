import { useAuth } from "../../context/AuthContext";

type ProfileAccountSettingsProps = {
  onDeleteAccount: () => void;
};

function ProfileAccountSettings({
  onDeleteAccount,
}: ProfileAccountSettingsProps) {
  const { role } = useAuth();
  const isAdmin = role === "Admin";

  return (
    <section className="profile-section profile-account profile-section--danger">
      <div>
        <span className="profile-label">Account</span>

        <h2>Account settings</h2>

        <p>Permanently delete your TechLingo account and all associated data.</p>
      </div>

      {!isAdmin ? (
        <button
          onClick={onDeleteAccount}
          className="profile__delete-button"
          type="button"
        >
          Delete account
        </button>
      ) : <span>Admin accounts cannot be deleted.</span>}
    </section>
  );
}

export default ProfileAccountSettings;
