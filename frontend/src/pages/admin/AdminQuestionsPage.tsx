import { useEffect, useState } from "react";

import { getAdminQuestions } from "../../api/adminApi";
import { getCategories } from "../../api/categoryApi";
import type { AdminQuestion } from "../../types/admin";
import type { Category } from "../../types/category";

import "../../styles/AdminPage.css";
import "../../styles/AdminTables.css";

function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    return categories.find((category) => category.id === categoryId)?.name ?? "Unknown";
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
            {questions.length} {questions.length === 1 ? "question" : "questions"}
          </p>

          <button className="admin-table__create-button" type="button">
            Create question
          </button>
        </div>

        {isLoading && <p className="admin-table__message">Loading questions...</p>}

        {error && <p className="admin-table__message">{error}</p>}

        {!isLoading && !error && (
          <div className="admin-table__table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">Question</th>
                  <th scope="col">Category</th>
                  <th scope="col">Status</th>
                  <th scope="col">Created</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question) => (
                  <tr key={question.id}>
                    <td className="admin-table__primary">{question.prompt}</td>
                    <td className="admin-table__secondary">
                      {getCategoryName(question.categoryId)}
                    </td>
                    <td>
                      <span
                        className={`admin-table__status admin-table__status--${question.isActive ? "active" : "inactive"}`}
                      >
                        {question.isActive ? "Active" : "Inactive"}
                      </span>
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
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminQuestionsPage;
