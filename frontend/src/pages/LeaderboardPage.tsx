import { useEffect, useState } from "react";

import { getLeaderboard } from "../api/userApi";
import type { LeaderboardUser } from "../types/user";

import goldMedal from "../assets/goldmedalTL.png";
import silverMedal from "../assets/silvermedalTL.png";
import bronzeMedal from "../assets/bronzemedalTL.png";

import "../styles/LeaderboardPage.css";

function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const data = await getLeaderboard();
        setUsers(data);
      } catch (error) {
        console.error("Failed to load leaderboard:", error);
        setError("Could not load leaderboard.");
      } finally {
        setIsLoading(false);
      }
    }

    loadLeaderboard();
  }, []);

  function getMedal(position: number) {
    switch (position) {
      case 1:
        return goldMedal;
      case 2:
        return silverMedal;
      case 3:
        return bronzeMedal;
      default:
        return null;
    }
  }

  if (isLoading) {
    return (
      <main className="leaderboard-page">
        <p>Loading leaderboard...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="leaderboard-page">
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="leaderboard-page">
      <div className="leaderboard-header">
        <span className="leaderboard-label">Top players</span>
        <h1>Leaderboard</h1>
        <p>See who has earned the most points in TechLingo.</p>
      </div>

      <div className="leaderboard-list">
        {users.map((user, index) => {
          const position = index + 1;
          const medal = getMedal(position);

          return (
            <div className="leaderboard-row" key={user.username}>
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
        })}
      </div>
    </main>
  );
}

export default LeaderboardPage;
