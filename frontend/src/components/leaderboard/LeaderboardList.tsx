import bronzeMedal from "../../assets/bronzemedalTL.png";
import goldMedal from "../../assets/goldmedalTL.png";
import silverMedal from "../../assets/silvermedalTL.png";
import type { LeaderboardUser } from "../../types/user";
import LeaderboardRow from "./LeaderboardRow";

type LeaderboardListProps = {
  users: LeaderboardUser[];
};

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

function LeaderboardList({ users }: LeaderboardListProps) {
  return (
    <div className="leaderboard-list">
      {users.map((user, index) => {
        const position = index + 1;

        return (
          <LeaderboardRow
            user={user}
            position={position}
            medal={getMedal(position)}
            key={user.username}
          />
        );
      })}
    </div>
  );
}

export default LeaderboardList;
