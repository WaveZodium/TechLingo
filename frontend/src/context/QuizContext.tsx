import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";

import { quitQuiz } from "../api/quizApi";
import { useUser } from "./UserContext";

type QuizContextType = {
  activeSessionId: string | null;
  isQuizActive: boolean;
  startSession: (sessionId: string) => void;
  finishSession: () => void;
  quitActiveSession: () => Promise<void>;
};

type QuizProviderProps = {
  children: ReactNode;
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: QuizProviderProps) {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const activeSessionIdRef = useRef<string | null>(null);

  const isQuittingRef = useRef(false);

  const { loadProfile } = useUser();

  const loadProfileRef = useRef(loadProfile);

  useEffect(() => {
    loadProfileRef.current = loadProfile;
  }, [loadProfile]);

  const isQuizActive = activeSessionId !== null;

  const startSession = useCallback((sessionId: string) => {
    activeSessionIdRef.current = sessionId;

    setActiveSessionId(sessionId);
  }, []);

  const finishSession = useCallback(() => {
    activeSessionIdRef.current = null;

    setActiveSessionId(null);
  }, []);

  const quitActiveSession = useCallback(async () => {
    const sessionId = activeSessionIdRef.current;

    if (!sessionId || isQuittingRef.current) {
      return;
    }

    try {
      isQuittingRef.current = true;

      await quitQuiz(sessionId);

      activeSessionIdRef.current = null;

      setActiveSessionId(null);

      try {
        await loadProfileRef.current();
      } catch (error) {
        console.error("Failed to reload profile after quitting quiz:", error);
      }
    } finally {
      isQuittingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!activeSessionId) {
      return;
    }

    const guardId = `quiz-guard-${activeSessionId}`;

    const addBrowserGuard = () => {
      if (window.history.state?.quizGuard === guardId) {
        return;
      }

      window.history.pushState(
        {
          ...window.history.state,
          quizGuard: guardId,
        },
        "",
        window.location.href,
      );
    };

    addBrowserGuard();

    const handleBrowserBack = () => {
      if (!activeSessionIdRef.current) {
        return;
      }

      const confirmed = window.confirm(
        "Are you sure you want to quit? Your quiz progress will be lost.",
      );

      if (!confirmed) {
        addBrowserGuard();
        return;
      }

      void quitActiveSession()
        .then(() => {
          window.history.back();
        })
        .catch((error) => {
          console.error("Failed to quit quiz after browser back:", error);

          addBrowserGuard();
        });
    };

    window.addEventListener("popstate", handleBrowserBack);

    return () => {
      window.removeEventListener("popstate", handleBrowserBack);
    };
  }, [activeSessionId, quitActiveSession]);

  return (
    <QuizContext.Provider
      value={{
        activeSessionId,
        isQuizActive,
        startSession,
        finishSession,
        quitActiveSession,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);

  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }

  return context;
}
