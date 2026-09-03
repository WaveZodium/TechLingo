import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
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

        {showRegister ? (
          <>
            <Register />

            <button type="button" onClick={() => setShowRegister(false)}>
              Already have an account? Login
            </button>
          </>
        ) : (
          <>
            <Login isOpen={isOpen} onLoginSuccess={handleClose} />

            <button type="button" onClick={() => setShowRegister(true)}>
              Don't have an account? Create account
            </button>
          </>
        )}
      </aside>
    </>
  );
}
