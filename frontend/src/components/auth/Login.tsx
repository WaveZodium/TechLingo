import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { SubmitEvent } from "react";
import axios from "axios";
import { login as loginApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

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

      login(); // Update the authentication state in the context
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
    <form onSubmit={handleSubmit}>
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

      {errorMessage && <p>{errorMessage}</p>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
