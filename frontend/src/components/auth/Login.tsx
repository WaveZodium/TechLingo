import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { SubmitEvent } from "react";
import axios from "axios";

import { login as loginApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

import AuthHeader from "./AuthHeader";
import FormField from "./FormField";
import PasswordField from "./PasswordField";

interface LoginProps {
  isOpen: boolean;
  onLoginSuccess: () => void;
}

export default function Login({ isOpen, onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setUsername("");
      setPassword("");
      setErrorMessage("");
    }
  }, [isOpen]);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    try {
      await loginApi({
        username,
        password,
      });

      login();
      onLoginSuccess();

      navigate("/overview");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.errorMessage ?? "Login failed.");
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
        title="Login"
        subtitle="Welcome back! Please login to your account."
      />

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

        <p
          className={`auth-form__error ${
            errorMessage ? "auth-form__error--visible" : ""
          }`}
          aria-live="polite"
        >
          {errorMessage}
        </p>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
