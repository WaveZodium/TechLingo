type ProfileAccountSettingsProps = {
  onDeleteAccount: () => void;
};

function ProfileAccountSettings({
  onDeleteAccount,
}: ProfileAccountSettingsProps) {
  return (
    <section className="profile-section profile-account profile-section--danger">
      <div>
        <span className="profile-label">Account</span>

        <h2>Account settings</h2>

        <p>Permanently delete your TechLingo account and all associated data.</p>
      </div>

      <button
        onClick={onDeleteAccount}
        className="profile__delete-button"
        type="button"
      >
        Delete account
      </button>
    </section>
  );
}

export default ProfileAccountSettings;
