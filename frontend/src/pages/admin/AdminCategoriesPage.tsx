import { useEffect, useState } from "react";

import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
} from "../../api/adminApi";

import AdminCategoryForm, {
  type CategoryFormData,
} from "../../components/admin/AdminCategoryForm";

import type { Category } from "../../types/category";

import "../../styles/AdminPage.css";
import "../../styles/AdminCategoriesPage.css";

function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State för formuläret
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Hämta kategorier
  useEffect(() => {
    async function loadCategories() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getAdminCategories();

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

  // Öppna formuläret för att skapa en kategori
  function handleCreate() {
    setEditingCategory(null);
    setIsFormOpen(true);
  }

  // Öppna formuläret för att redigera en kategori
  function handleEdit(category: Category) {
    setEditingCategory(category);
    setIsFormOpen(true);
  }

  // Stäng formuläret
  function handleCancel() {
    setIsFormOpen(false);
    setEditingCategory(null);
  }

  // Spara en ny eller befintlig kategori
  async function handleSave(data: CategoryFormData) {
    if (editingCategory) {
      const updated = await updateAdminCategory(editingCategory.id, data);

      setCategories((previous) =>
        previous.map((category) =>
          category.id === updated.id ? updated : category,
        ),
      );
    } else {
      const created = await createAdminCategory(data);

      setCategories((previous) => [...previous, created]);
    }

    handleCancel();
  }

  return (
    <section className="admin">
      <div className="admin__content">
        <header className="admin__header">
          <h1 className="admin__title">Manage categories</h1>

          <p className="admin__description">
            Create and organize the categories available to TechLingo players.
          </p>
        </header>

        {/* Formulär för Create och Edit */}
        {isFormOpen && (
          <AdminCategoryForm
            key={editingCategory?.id ?? "create"}
            category={editingCategory}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}

        <div className="admin-categories__toolbar">
          <p className="admin-categories__count">
            {categories.length}{" "}
            {categories.length === 1 ? "category" : "categories"}
          </p>

          <button
            className="button-primary admin-categories__create-button"
            type="button"
            onClick={handleCreate}
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
                        className={`admin-categories__status admin-categories__status--${
                          category.isActive ? "active" : "inactive"
                        }`}
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
                          onClick={() => handleEdit(category)}
                        >
                          Edit
                        </button>

                        <button
                          className="admin-categories__action admin-categories__action--delete"
                          type="button"
                          disabled
                          title="Delete is not implemented yet"
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
