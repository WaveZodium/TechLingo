interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <>
      <div className="auth-form__heading">
        <svg
          className="auth-form__heading-icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
        </svg>

        <h2>{title}</h2>
      </div>

      <p className="auth-form__subtitle">{subtitle}</p>
    </>
  );
}
