import { forwardRef } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  function FormField({ id, label, type = "text", value, onChange }, ref) {
    return (
      <div className="auth-form__field">
        <label htmlFor={id}>{label}</label>

        <input
          ref={ref}
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required
        />
      </div>
    );
  },
);

export default FormField;
