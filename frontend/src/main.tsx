import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { UserProvider } from "./context/UserContext.tsx";
import { QuizProvider } from "./context/QuizContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <UserProvider>
        <QuizProvider>
          <App />
        </QuizProvider>
      </UserProvider>
    </AuthProvider>
  </StrictMode>,
);
