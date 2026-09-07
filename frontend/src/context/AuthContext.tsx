import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  isAuthenticated,
  logout,
  getTokenExpiration,
  getToken,
  getTokenRole,
  type UserRole,
} from "../api/authApi";

type AuthContextType = {
  isAuth: boolean;
  role: UserRole | null;
  login: () => void;
  logoutUser: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuth, setIsAuth] = useState(isAuthenticated);

  const [role, setRole] = useState<UserRole | null>(() => {
    const token = getToken();

    if (!token) {
      return null;
    }

    return getTokenRole(token);
  });

  const hasAlertedForExpiredToken = useRef(false);

  function login() {
    const token = getToken();

    setIsAuth(true);
    setRole(token ? getTokenRole(token) : null);

    hasAlertedForExpiredToken.current = false;
  }

  function logoutUser() {
    logout();

    setIsAuth(false);
    setRole(null);
  }

  useEffect(() => {
    function handleTokenExpired() {
      if (!hasAlertedForExpiredToken.current) {
        alert("Your session has expired. Please log in again.");
        hasAlertedForExpiredToken.current = true;
      }

      logout();

      setIsAuth(false);
      setRole(null);
    }

    window.addEventListener("auth-expired", handleTokenExpired);

    if (!isAuth) {
      return () => {
        window.removeEventListener("auth-expired", handleTokenExpired);
      };
    }

    const token = getToken();

    if (!token) {
      setIsAuth(false);
      setRole(null);

      return () => {
        window.removeEventListener("auth-expired", handleTokenExpired);
      };
    }

    const expirationTime = getTokenExpiration(token);

    if (!expirationTime) {
      return () => {
        window.removeEventListener("auth-expired", handleTokenExpired);
      };
    }

    const timeUntilExpiration = expirationTime - Date.now();

    if (timeUntilExpiration <= 0) {
      handleTokenExpired();

      return () => {
        window.removeEventListener("auth-expired", handleTokenExpired);
      };
    }

    const timeout = window.setTimeout(handleTokenExpired, timeUntilExpiration);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("auth-expired", handleTokenExpired);
    };
  }, [isAuth]);

  return (
    <AuthContext.Provider value={{ isAuth, role, login, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
