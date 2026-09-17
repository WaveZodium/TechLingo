import { useEffect, useState } from "react";

import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from "../../api/adminApi";

import { getToken, getTokenUserId } from "../../api/authApi";

import AdminUserForm from "../../components/admin/AdminUserForm";

import "../../styles/AdminPage.css";
import "../../styles/AdminTables.css";
import "../../styles/AdminUsersPage.css";

import type {
  AdminUser,
  CreateAdminUserData,
  UpdateAdminUserData,
} from "../../types/admin";

import { userRoleToText } from "../../enums/userRole";

import "../../styles/AdminPage.css";
import "../../styles/AdminTables.css";

function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Formulär för Create och Edit
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  // Borttagning
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const token = getToken();
  const userId = token ? getTokenUserId(token) : null;

  // Hämta användare
  useEffect(() => {
    async function loadUsers() {
      try {
        setIsLoading(true);
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

  // Öppna formuläret för att skapa en användare
  function handleCreate() {
    setEditingUser(null);
    setDeleteError(null);
    setIsFormOpen(true);
  }

  // Öppna formuläret för att redigera en användare
  function handleEdit(user: AdminUser) {
    if (user.id === userId) {
      return;
    }

    setEditingUser(user);
    setDeleteError(null);
    setIsFormOpen(true);
  }

  // Stäng formuläret
  function handleCancel() {
    setIsFormOpen(false);
    setEditingUser(null);
  }

  // Spara en ny eller befintlig användare
  async function handleSave(data: CreateAdminUserData | UpdateAdminUserData) {
    if (editingUser) {
      const updated = await updateAdminUser(editingUser.id, {
        username: data.username,
        role: data.role,
      });

      setUsers((previous) =>
        previous.map((user) => (user.id === updated.id ? updated : user)),
      );
    } else {
      if (!("password" in data)) {
        throw new Error("Password is required.");
      }

      const created = await createAdminUser(data);

      setUsers((previous) => [...previous, created]);
    }

    handleCancel();
  }

  // Radera en användare
  async function handleDelete(user: AdminUser) {
    if (user.id === userId || deletingId !== null) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${user.username}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(user.id);
      setDeleteError(null);

      await deleteAdminUser(user.id);

      // Uppdatera tabellen först när API-anropet lyckats
      setUsers((previous) => previous.filter((item) => item.id !== user.id));

      // Stäng formuläret om samma användare redigerades
      if (editingUser?.id === user.id) {
        handleCancel();
      }
    } catch (error) {
      console.error("Failed to delete user:", error);

      setDeleteError(`Could not delete "${user.username}". Please try again.`);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="admin">
      <div className="admin__content">
        <header className="admin__header">
          <h1 className="admin__title">Manage users</h1>

          <p className="admin__description">
            View accounts and maintain access for TechLingo users.
          </p>
        </header>

        {/* Formulär */}
        {isFormOpen && (
          <AdminUserForm
            key={editingUser?.id ?? "create"}
            user={editingUser}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}

        <div className="admin-table__toolbar">
          <p className="admin-table__count">
            {users.length} {users.length === 1 ? "user" : "users"}
          </p>

          <button
            className="button-primary admin-table__create-button"
            type="button"
            onClick={handleCreate}
            disabled={deletingId !== null}
          >
            Create user
          </button>
        </div>

        {isLoading && <p className="admin-table__message">Loading users...</p>}

        {error && (
          <p className="admin-table__message" role="alert">
            {error}
          </p>
        )}

        {deleteError && (
          <p
            className="admin-table__message admin-table__message--error"
            role="alert"
          >
            {deleteError}
          </p>
        )}

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
                              onClick={() => handleEdit(user)}
                              disabled={deletingId !== null}
                            >
                              Edit
                            </button>

                            <button
                              className="admin-table__action admin-table__action--delete"
                              type="button"
                              onClick={() => handleDelete(user)}
                              disabled={deletingId !== null}
                            >
                              {deletingId === user.id
                                ? "Deleting..."
                                : "Delete"}
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
