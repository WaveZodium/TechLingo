import { useEffect, useState } from "react";

import { deleteAdminQuestion, getAdminQuestions } from "../../api/adminApi";
import { getCategories } from "../../api/categoryApi";

import type { AdminQuestion } from "../../types/admin";
import type { Category } from "../../types/category";

import "../../styles/AdminPage.css";
import "../../styles/AdminTables.css";

function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    async function loadQuestions() {
      try {
        setError(null);

        const [questionData, categoryData] = await Promise.all([
          getAdminQuestions(),
          getCategories(),
        ]);

        setQuestions(questionData);
        setCategories(categoryData);
      } catch (error) {
        console.error("Failed to load questions:", error);
        setError("Could not load questions.");
      } finally {
        setIsLoading(false);
      }
    }

    loadQuestions();
  }, []);

  function getCategoryName(categoryId: string) {
    return (
      categories.find((category) => category.id === categoryId)?.name ??
      "Unknown"
    );
  }

  const filteredQuestions = selectedCategoryId
    ? questions.filter((question) => question.categoryId === selectedCategoryId)
    : questions;

  async function handleDelete(question: AdminQuestion) {
    if (deletingId !== null) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${question.prompt}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(question.id);
      setDeleteError(null);

      await deleteAdminQuestion(question.id);

      setQuestions((previous) =>
        previous.filter((item) => item.id !== question.id),
      );
    } catch (error) {
      console.error("Failed to delete question:", error);

      setDeleteError(
        `Could not delete "${question.prompt}". Please try again.`,
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="admin">
      <div className="admin__content">
        <header className="admin__header">
          <h1 className="admin__title">Manage questions</h1>

          <p className="admin__description">
            Create and maintain questions and answer options for each quiz.
          </p>
        </header>

        <div className="admin-table__toolbar">
          <p className="admin-table__count">
            {filteredQuestions.length}{" "}
            {filteredQuestions.length === 1 ? "question" : "questions"}
          </p>

          <div className="admin-table__toolbar-actions">
            <label className="admin-table__filter">
              <span className="admin-table__filter-label">Category</span>

              <div className="admin-table__select-wrapper">
                <select
                  className="admin-table__filter-select"
                  value={selectedCategoryId}
                  onChange={(event) =>
                    setSelectedCategoryId(event.target.value)
                  }
                >
                  <option value="">All categories</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </label>

            <button
              className="button-primary admin-table__create-button"
              type="button"
            >
              Create question
            </button>
          </div>
        </div>

        {isLoading && (
          <p className="admin-table__message">Loading questions...</p>
        )}

        {error && (
          <p className="admin-table__message" role="alert">
            {error}
          </p>
        )}

        {deleteError && (
          <p className="admin-table__delete-error" role="alert">
            {deleteError}
          </p>
        )}

        {!isLoading && !error && (
          <div className="admin-table__table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">Question</th>
                  <th scope="col">Category</th>
                  <th scope="col">Created</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredQuestions.map((question) => (
                  <tr key={question.id}>
                    <td className="admin-table__primary">{question.prompt}</td>

                    <td className="admin-table__secondary">
                      {getCategoryName(question.categoryId)}
                    </td>

                    <td>{new Date(question.createdAt).toLocaleDateString()}</td>

                    <td>
                      <div className="admin-table__actions">
                        <button className="admin-table__action" type="button">
                          Edit
                        </button>

                        <button
                          className="admin-table__action admin-table__action--delete"
                          type="button"
                          onClick={() => handleDelete(question)}
                          disabled={deletingId !== null}
                        >
                          {deletingId === question.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredQuestions.length === 0 && (
                  <tr>
                    <td className="admin-table__empty" colSpan={4}>
                      No questions found for this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminQuestionsPage;
