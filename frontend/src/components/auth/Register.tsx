import { useState } from "react";
import type { SubmitEvent } from "react";
import axios from "axios";

import { register } from "../../api/authApi";
import type { ErrorResponse } from "../../types/auth";

import AuthHeader from "./AuthHeader";
import FormField from "./FormField";
import PasswordField from "./PasswordField";

interface RegisterProps {
  onRegisterSuccess: () => void;
}

export default function Register({ onRegisterSuccess }: RegisterProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await register({
        username,
        password,
      });

      onRegisterSuccess();
    } catch (error) {
      if (axios.isAxiosError<ErrorResponse>(error)) {
        setErrorMessage(
          error.response?.data?.errorMessage ?? "Registration failed.",
        );
      } else {
        setErrorMessage("Something went wrong.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-form">
      <AuthHeader
        title="Create account"
        subtitle="Create your account and start learning."
      />

      <form onSubmit={handleSubmit}>
        <FormField
          id="register-username"
          label="Username"
          value={username}
          onChange={setUsername}
        />

        <PasswordField
          id="register-password"
          label="Password"
          value={password}
          onChange={setPassword}
        />

        <PasswordField
          id="register-confirm-password"
          label="Confirm password"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />

        <p
          className={`auth-form__error ${
            errorMessage ? "auth-form__error--visible" : ""
          }`}
          aria-live="polite"
        >
          {errorMessage}
        </p>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </div>
  );
}
