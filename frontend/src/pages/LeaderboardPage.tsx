import { useEffect, useState } from "react";

import { getLeaderboard } from "../api/userApi";
import LeaderboardHeader from "../components/leaderboard/LeaderboardHeader";
import LeaderboardList from "../components/leaderboard/LeaderboardList";
import type { LeaderboardUser } from "../types/user";

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
      <LeaderboardHeader />

      <LeaderboardList users={users} />
    </main>
  );
}

export default LeaderboardPage;
