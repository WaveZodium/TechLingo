import { useId, useState, type SyntheticEvent } from "react";

import type {
  AdminAnswerOption,
  AdminQuestion,
  QuestionFormData,
} from "../../types/admin";
import type { Category } from "../../types/category";

import "../../styles/AdminQuestionForm.css";

interface AdminQuestionFormProps {
  question?: AdminQuestion | null;
  categories: Category[];
  onSave: (data: QuestionFormData) => Promise<void>;
  onCancel: () => void;
}

function createEmptyOptions(): AdminAnswerOption[] {
  return [
    {
      id: "",
      text: "",
      isCorrect: false,
    },
    {
      id: "",
      text: "",
      isCorrect: false,
    },
    {
      id: "",
      text: "",
      isCorrect: false,
    },
    {
      id: "",
      text: "",
      isCorrect: false,
    },
  ];
}

function getInitialOptions(
  question?: AdminQuestion | null,
): AdminAnswerOption[] {
  if (!question) {
    return createEmptyOptions();
  }

  const existingOptions = question.options.map((option) => ({
    ...option,
  }));

  while (existingOptions.length < 4) {
    existingOptions.push({
      id: "",
      text: "",
      isCorrect: false,
    });
  }

  return existingOptions;
}

function AdminQuestionForm({
  question,
  categories,
  onSave,
  onCancel,
}: AdminQuestionFormProps) {
  const isEditing = Boolean(question);
  const formId = useId();

  const [form, setForm] = useState<QuestionFormData>({
    categoryId: question?.categoryId ?? "",
    message: question?.message ?? "",
    prompt: question?.prompt ?? "",
    options: getInitialOptions(question),
    explanation: question?.explanation ?? "",
    isActive: question?.isActive ?? true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof QuestionFormData>(
    field: K,
    value: QuestionFormData[K],
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function updateOptionText(index: number, value: string) {
    setForm((previous) => ({
      ...previous,
      options: previous.options.map((option, optionIndex) =>
        optionIndex === index
          ? {
              ...option,
              text: value,
            }
          : option,
      ),
    }));
  }

  function setCorrectOption(index: number) {
    setForm((previous) => ({
      ...previous,
      options: previous.options.map((option, optionIndex) => ({
        ...option,
        isCorrect: optionIndex === index,
      })),
    }));
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const categoryId = form.categoryId.trim();
    const message = form.message.trim();
    const prompt = form.prompt.trim();

    const options = form.options.map((option) => ({
      ...option,
      text: option.text.trim(),
    }));

    if (!categoryId) {
      setError("Select a category.");
      return;
    }

    if (!message || !prompt) {
      setError("Message and question are required.");
      return;
    }

    if (options.some((option) => !option.text)) {
      setError("All answer options are required.");
      return;
    }

    const correctOptions = options.filter((option) => option.isCorrect);

    if (correctOptions.length !== 1) {
      setError("Select one correct answer.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      await onSave({
        categoryId,
        message,
        prompt,
        options,
        explanation: form.explanation?.trim() || null,
        isActive: form.isActive,
      });
    } catch (error) {
      console.error("Failed to save question:", error);

      setError("Could not save question. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  const hasSelectedCategory = Boolean(form.categoryId);

  return (
    <form className="admin-question-form" onSubmit={handleSubmit}>
      <h2 className="admin-question-form__title">
        {isEditing ? "Edit question" : "Create question"}
      </h2>

      <div className="admin-question-form__field">
        <label htmlFor={`${formId}-category`}>Category</label>

        <div className="admin-question-form__select-wrapper">
          <select
            id={`${formId}-category`}
            value={form.categoryId}
            onChange={(event) => updateField("categoryId", event.target.value)}
            disabled={isSaving}
            required
            autoFocus={!isEditing}
          >
            <option value="">Select category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasSelectedCategory && (
        <>
          <div className="admin-question-form__field">
            <label htmlFor={`${formId}-message`}>Message</label>

            <input
              id={`${formId}-message`}
              type="text"
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
              placeholder="Example sentence or context"
              disabled={isSaving}
              required
            />
          </div>

          <div className="admin-question-form__field">
            <label htmlFor={`${formId}-prompt`}>Question</label>

            <input
              id={`${formId}-prompt`}
              type="text"
              value={form.prompt}
              onChange={(event) => updateField("prompt", event.target.value)}
              placeholder="What does API mean?"
              disabled={isSaving}
              required
            />
          </div>

          <fieldset className="admin-question-form__answers">
            <legend>Answer options</legend>

            <p className="admin-question-form__answers-description">
              Enter four answers and select the correct one.
            </p>

            <div className="admin-question-form__answer-list">
              {form.options.map((option, index) => (
                <div
                  className="admin-question-form__answer"
                  key={option.id || index}
                >
                  <input
                    className="admin-question-form__radio"
                    id={`${formId}-correct-${index}`}
                    type="radio"
                    name={`${formId}-correct-answer`}
                    checked={option.isCorrect}
                    onChange={() => setCorrectOption(index)}
                    disabled={isSaving}
                    aria-label={`Mark answer ${index + 1} as correct`}
                  />

                  <div className="admin-question-form__answer-field">
                    <label htmlFor={`${formId}-answer-${index}`}>
                      Answer {index + 1}
                    </label>

                    <input
                      id={`${formId}-answer-${index}`}
                      type="text"
                      value={option.text}
                      onChange={(event) =>
                        updateOptionText(index, event.target.value)
                      }
                      placeholder={`Answer option ${index + 1}`}
                      disabled={isSaving}
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </fieldset>

          <div className="admin-question-form__field">
            <label htmlFor={`${formId}-explanation`}>Explanation</label>

            <textarea
              id={`${formId}-explanation`}
              value={form.explanation ?? ""}
              onChange={(event) =>
                updateField("explanation", event.target.value)
              }
              placeholder="Explain why the correct answer is correct"
              rows={3}
              disabled={isSaving}
            />
          </div>
        </>
      )}

      {error && (
        <p className="admin-question-form__error" role="alert">
          {error}
        </p>
      )}

      <div className="admin-question-form__actions">
        <button
          type="button"
          className="admin-question-form__cancel"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </button>

        {hasSelectedCategory && (
          <button type="submit" className="button-primary" disabled={isSaving}>
            {isSaving
              ? "Saving..."
              : isEditing
                ? "Save changes"
                : "Create question"}
          </button>
        )}
      </div>
    </form>
  );
}

export default AdminQuestionForm;
