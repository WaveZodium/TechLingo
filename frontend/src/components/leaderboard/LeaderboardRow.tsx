import type { LeaderboardUser } from "../../types/user";

type LeaderboardRowProps = {
  user: LeaderboardUser;
  position: number;
  medal: string | null;
};

function LeaderboardRow({ user, position, medal }: LeaderboardRowProps) {
  return (
    <div className="leaderboard-row">
      <div className="leaderboard-position">
        {medal ? (
          <img
            src={medal}
            alt={`Position ${position} medal`}
            className="leaderboard-medal"
          />
        ) : (
          <span>{position}</span>
        )}
      </div>

      <span className="leaderboard-username">{user.username}</span>

      <div className="leaderboard-score">
        <strong>{user.totalScore}</strong>
        <span> points</span>
      </div>
    </div>
  );
}

export default LeaderboardRow;
