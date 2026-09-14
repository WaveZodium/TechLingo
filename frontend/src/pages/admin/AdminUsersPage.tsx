import { useEffect, useState } from "react";

import { getAdminUsers } from "../../api/adminApi";
import { getToken, getTokenUserId } from "../../api/authApi";
import type { AdminUser } from "../../types/admin";

import { userRoleToText } from "../../enums/userRole";

import "../../styles/AdminPage.css";
import "../../styles/AdminTables.css";

function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = getToken();
  const userId = token ? getTokenUserId(token) : null;

  useEffect(() => {
    async function loadUsers() {
      try {
        setError(null);

        const data = await getAdminUsers();

        setUsers(data);
      } catch (error) {
        console.error("Failed to load users:", error);
        setError("Could not load users.");
      } finally {
        setIsLoading(false);
      }
    }

    loadUsers();
  }, []);

  return (
    <section className="admin">
      <div className="admin__content">
        <header className="admin__header">
          <h1 className="admin__title">Manage users</h1>

          <p className="admin__description">
            View accounts and maintain access for TechLingo users.
          </p>
        </header>

        <div className="admin-table__toolbar">
          <p className="admin-table__count">
            {users.length} {users.length === 1 ? "user" : "users"}
          </p>

          <button className="admin-table__create-button" type="button">
            Create user
          </button>
        </div>

        {isLoading && <p className="admin-table__message">Loading users...</p>}

        {error && <p className="admin-table__message">{error}</p>}

        {!isLoading && !error && (
          <div className="admin-table__table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">Username</th>
                  <th scope="col">Role</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isCurrentUser = user.id === userId;

                  return (
                    <tr key={user.id}>
                      <td className="admin-table__primary">{user.username}</td>
                      <td>
                        <span className="admin-table__status admin-table__status--active">
                          {userRoleToText(user.role)}
                        </span>
                      </td>
                      <td>
                        {isCurrentUser ? (
                          <span className="admin-table__secondary">
                            Current user
                          </span>
                        ) : (
                          <div className="admin-table__actions">
                            <button
                              className="admin-table__action"
                              type="button"
                            >
                              Edit
                            </button>
                            <button
                              className="admin-table__action admin-table__action--delete"
                              type="button"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminUsersPage;
