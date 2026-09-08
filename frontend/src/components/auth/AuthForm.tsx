import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SubmitEvent } from "react";
import axios from "axios";

import { login as loginApi, register as registerApi } from "../../api/authApi";

import type { ErrorResponse } from "../../types/auth";
import { useAuth } from "../../context/AuthContext";

import AuthHeader from "./AuthHeader";
import FormField from "./FormField";
import PasswordField from "./PasswordField";

interface AuthFormProps {
  isOpen: boolean;
  isRegisterMode: boolean;
  onLoginSuccess: () => void;
  onRegisterSuccess: () => void;
}

export default function AuthForm({
  isOpen,
  isRegisterMode,
  onLoginSuccess,
  onRegisterSuccess,
}: AuthFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [infoMessage, setInfoMessage] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setInfoMessage(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isRegisterMode) {
      setInfoMessage(null);
    }

    if (!isRegisterMode) {
      setConfirmPassword("");

      setInfoMessage((currentMessage) =>
        currentMessage?.type === "success" ? currentMessage : null,
      );
    }
  }, [isRegisterMode]);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setInfoMessage(null);

    if (isRegisterMode && password !== confirmPassword) {
      setInfoMessage({ text: "Passwords do not match.", type: "error" });
      return;
    }

    setIsLoading(true);

    try {
      if (isRegisterMode) {
        await registerApi({
          username,
          password,
        });

        setInfoMessage({
          text: "Account created! You can now log in.",
          type: "success",
        });

        onRegisterSuccess();
      } else {
        await loginApi({
          username,
          password,
        });

        login();
        onLoginSuccess();

        navigate("/categories");
      }
    } catch (error) {
      if (axios.isAxiosError<ErrorResponse>(error)) {
        setInfoMessage({
          text:
            error.response?.data?.errorMessage ??
            (isRegisterMode ? "Registration failed." : "Login failed."),
          type: "error",
        });
      } else {
        setInfoMessage({ text: "Something went wrong.", type: "error" });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-form">
      <div
        key={isRegisterMode ? "register-header" : "login-header"}
        className="auth-form__header-fade"
      >
        <AuthHeader
          title={isRegisterMode ? "Create account" : "Login"}
          subtitle={
            isRegisterMode
              ? "Create your account and start learning."
              : "Welcome back! Please login to your account."
          }
        />
      </div>

      <form onSubmit={handleSubmit}>
        <FormField
          id="username"
          label="Username"
          value={username}
          onChange={setUsername}
        />

        <PasswordField
          id="password"
          label="Password"
          value={password}
          onChange={setPassword}
        />

        <div
          className={`auth-form__confirm ${
            isRegisterMode ? "auth-form__confirm--visible" : ""
          }`}
          aria-hidden={!isRegisterMode}
        >
          <PasswordField
            id="confirm-password"
            label="Confirm password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            disabled={!isRegisterMode}
          />
        </div>

        <p
          className={`auth-form__message ${
            infoMessage ? `auth-form__message--${infoMessage.type}` : ""
          }`}
          aria-live="polite"
        >
          {infoMessage?.text}
        </p>

        <button type="submit" disabled={isLoading}>
          <span
            key={`${isRegisterMode}-${isLoading}`}
            className="auth-form__button-text"
          >
            {isLoading
              ? isRegisterMode
                ? "Creating account..."
                : "Logging in..."
              : isRegisterMode
                ? "Create account"
                : "Login"}
          </span>
        </button>
      </form>
    </div>
  );
}
