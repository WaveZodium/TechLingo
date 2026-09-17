import { useId, useState, type SyntheticEvent } from "react";

import { UserRole } from "../../enums/userRole";

import type {
  AdminUser,
  CreateAdminUserData,
  UpdateAdminUserData,
} from "../../types/admin";

interface AdminUserFormProps {
  user?: AdminUser | null;
  onSave: (data: CreateAdminUserData | UpdateAdminUserData) => Promise<void>;
  onCancel: () => void;
}

function AdminUserForm({ user, onSave, onCancel }: AdminUserFormProps) {
  const isEditing = Boolean(user);
  const formId = useId();

  const [username, setUsername] = useState(user?.username ?? "");

  const [password, setPassword] = useState("");

  const [role, setRole] = useState<UserRole>(user?.role ?? UserRole.User);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError("Username is required.");
      return;
    }

    if (!isEditing && !password.trim()) {
      setError("Password is required.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      if (isEditing) {
        await onSave({
          username: trimmedUsername,
          role,
        });
      } else {
        await onSave({
          username: trimmedUsername,
          password,
          role,
        });
      }
    } catch (error) {
      console.error("Failed to save user:", error);

      setError("Could not save user. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="admin-user-form" onSubmit={handleSubmit}>
      <h2 className="admin-user-form__title">
        {isEditing ? "Edit user" : "Create user"}
      </h2>

      <div className="admin-user-form__field">
        <label htmlFor={`${formId}-username`}>Username</label>

        <input
          id={`${formId}-username`}
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Username"
          autoComplete="off"
          autoFocus
          required
          disabled={isSaving}
        />
      </div>

      {!isEditing && (
        <div className="admin-user-form__field">
          <label htmlFor={`${formId}-password`}>Password</label>

          <input
            id={`${formId}-password`}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            autoComplete="new-password"
            required
            disabled={isSaving}
          />
        </div>
      )}

      <div className="admin-user-form__field">
        <label htmlFor={`${formId}-role`}>Role</label>

        <div className="admin-user-form__select-wrapper">
          <select
            id={`${formId}-role`}
            value={role}
            onChange={(event) =>
              setRole(Number(event.target.value) as UserRole)
            }
            disabled={isSaving}
          >
            <option value={UserRole.User}>User</option>
            <option value={UserRole.Admin}>Admin</option>
            <option value={UserRole.Guest}>Guest</option>
          </select>
        </div>
      </div>

      {error && (
        <p className="admin-user-form__error" role="alert">
          {error}
        </p>
      )}

      <div className="admin-user-form__actions">
        <button
          type="button"
          className="admin-user-form__cancel"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </button>

        <button type="submit" className="button-primary" disabled={isSaving}>
          {isSaving ? "Saving..." : isEditing ? "Save changes" : "Create user"}
        </button>
      </div>
    </form>
  );
}

export default AdminUserForm;
