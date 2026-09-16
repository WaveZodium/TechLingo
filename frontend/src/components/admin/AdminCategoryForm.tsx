import { useId, useState, type SyntheticEvent } from "react";
import type { Category } from "../../types/category";

export type CategoryFormData = Pick<
  Category,
  "name" | "slug" | "description" | "isActive"
>;

interface AdminCategoryFormProps {
  category?: Category | null;
  onSave: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
}

function AdminCategoryForm({
  category,
  onSave,
  onCancel,
}: AdminCategoryFormProps) {
  const isEditing = Boolean(category);
  const formId = useId();

  const [form, setForm] = useState<CategoryFormData>({
    name: category?.name ?? "",
    slug: category?.slug ?? "",
    description: category?.description ?? "",
    isActive: category?.isActive ?? true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof CategoryFormData>(
    field: K,
    value: CategoryFormData[K],
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = form.name.trim();
    const slug = form.slug.trim();

    if (!name || !slug) {
      setError("Name and slug are required.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      await onSave({
        name,
        slug,
        description: form.description?.trim() || null,
        isActive: form.isActive,
      });
    } catch (error) {
      console.error("Failed to save category:", error);
      setError("Could not save category. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="admin-category-form" onSubmit={handleSubmit}>
      <h2 className="admin-category-form__title">
        {isEditing ? "Edit category" : "Create category"}
      </h2>

      <div className="admin-category-form__field">
        <label htmlFor={`${formId}-name`}>Name</label>

        <input
          id={`${formId}-name`}
          type="text"
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
          placeholder="Category name"
          autoFocus
          required
          disabled={isSaving}
        />
      </div>

      <div className="admin-category-form__field">
        <label htmlFor={`${formId}-slug`}>Slug</label>

        <input
          id={`${formId}-slug`}
          type="text"
          value={form.slug}
          onChange={(event) => updateField("slug", event.target.value)}
          placeholder="category-name"
          required
          disabled={isSaving}
        />
      </div>

      <div className="admin-category-form__field">
        <label htmlFor={`${formId}-description`}>Description</label>

        <textarea
          id={`${formId}-description`}
          value={form.description ?? ""}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Category description"
          rows={3}
          disabled={isSaving}
        />
      </div>

      <label className="admin-category-form__checkbox">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(event) => updateField("isActive", event.target.checked)}
          disabled={isSaving}
        />
        Active category
      </label>

      {error && (
        <p className="admin-category-form__error" role="alert">
          {error}
        </p>
      )}

      <div className="admin-category-form__actions">
        <button
          type="button"
          className="admin-category-form__cancel"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </button>

        <button type="submit" className="button-primary" disabled={isSaving}>
          {isSaving
            ? "Saving..."
            : isEditing
              ? "Save changes"
              : "Create category"}
        </button>
      </div>
    </form>
  );
}

export default AdminCategoryForm;
