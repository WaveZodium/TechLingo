import { useEffect, useState } from "react";

import { getCategories } from "../../api/categoryApi";
import type { Category } from "../../types/category";

import "../../styles/AdminPage.css";
import "../../styles/AdminCategoriesPage.css";

function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getCategories();

        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
        setError("Could not load categories.");
      } finally {
        setIsLoading(false);
      }
    }

    loadCategories();
  }, []);

  return (
    <section className="admin">
      <div className="admin__content">
        <header className="admin__header">
          <h1 className="admin__title">Manage categories</h1>

          <p className="admin__description">
            Create and organize the categories available to TechLingo players.
          </p>
        </header>

        <div className="admin-categories__toolbar">
          <p className="admin-categories__count">
            {categories.length}{" "}
            {categories.length === 1 ? "category" : "categories"}
          </p>

          <button
            className="button-primary admin-categories__create-button"
            type="button"
          >
            Create category
          </button>
        </div>

        {isLoading && (
          <p className="admin-categories__message">Loading categories...</p>
        )}

        {error && <p className="admin-categories__message">{error}</p>}

        {!isLoading && !error && (
          <div className="admin-categories__table-wrapper">
            <table className="admin-categories__table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Slug</th>
                  <th scope="col">Status</th>
                  <th scope="col">Created</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="admin-categories__name">{category.name}</td>
                    <td className="admin-categories__slug">{category.slug}</td>
                    <td>
                      <span
                        className={`admin-categories__status admin-categories__status--${category.isActive ? "active" : "inactive"}`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>{new Date(category.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="admin-categories__actions">
                        <button
                          className="admin-categories__action"
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          className="admin-categories__action admin-categories__action--delete"
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

export default AdminCategoriesPage;
