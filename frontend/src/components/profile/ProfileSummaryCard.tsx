import type { UserProfile } from "../../types/user";

type ProfileSummaryCardProps = {
  profile: UserProfile | null;
};

function ProfileSummaryCard({ profile }: ProfileSummaryCardProps) {
  return (
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
  );
}

export default ProfileSummaryCard;
