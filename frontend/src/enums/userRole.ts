export const UserRole = {
  Admin: 0,
  User: 1,
  Guest: 2
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export function userRoleToText(role: UserRole): string {
  switch (role) {
    case UserRole.Admin:
      return "Admin";
    case UserRole.User:
      return "User";
    case UserRole.Guest:
      return "Guest";
    default:
      return "Unknown";
  }
}