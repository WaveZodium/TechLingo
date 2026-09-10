export function RobotAvatar() {
  return (
    <span className="robot-avatar" aria-hidden="true">
      <span className="robot-antenna" />

      <span className="robot-face">
        <span className="robot-eye robot-eye-left" />
        <span className="robot-eye robot-eye-right" />
        <span className="robot-mouth" />
      </span>
    </span>
  );
}

export function UserAvatar() {
  return (
    <span className="user-avatar" aria-hidden="true">
      <span className="user-head" />
      <span className="user-shoulders" />
    </span>
  );
}
