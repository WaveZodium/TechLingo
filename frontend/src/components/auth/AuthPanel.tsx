import { useState } from "react";
import AuthForm from "./AuthForm";
import "../../styles/AuthPanel.css";

interface AuthPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthPanel({ isOpen, onClose }: AuthPanelProps) {
  const [showRegister, setShowRegister] = useState(false);

  function handleClose() {
    setShowRegister(false);
    onClose();
  }

  return (
    <>
      {isOpen && <div className="auth-panel__overlay" onClick={handleClose} />}

      <aside className={`auth-panel ${isOpen ? "auth-panel--open" : ""}`}>
        <button
          type="button"
          className="auth-panel__close"
          onClick={handleClose}
          aria-label="Close"
        >
          ×
        </button>

        <AuthForm
          isOpen={isOpen}
          isRegisterMode={showRegister}
          onLoginSuccess={handleClose}
          onRegisterSuccess={() => setShowRegister(false)}
        />

        <div className="auth-panel__switch">
          <button
            type="button"
            onClick={() => setShowRegister((prev) => !prev)}
          >
            <span
              key={showRegister ? "login-switch" : "register-switch"}
              className="auth-panel__switch-text"
            >
              {showRegister
                ? "Already have an account? Login"
                : "Don't have an account? Create account"}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
