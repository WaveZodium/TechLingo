import { useState } from "react";
import type { SubmitEvent } from "react";
import axios from "axios";

import { register } from "../../api/authApi";
import type { ErrorResponse } from "../../types/auth";

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
    <form onSubmit={handleSubmit}>
      <h2>Create account</h2>

      <input
        type="text"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        placeholder="Username"
        required
      />

      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Password"
        required
      />

      <input
        type="password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        placeholder="Confirm password"
        required
      />

      {errorMessage && <p>{errorMessage}</p>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
