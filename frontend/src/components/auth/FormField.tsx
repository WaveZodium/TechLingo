interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
}: FormFieldProps) {
  return (
    <div className="auth-form__field">
      <label htmlFor={id}>{label}</label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
      />
    </div>
  );
}
