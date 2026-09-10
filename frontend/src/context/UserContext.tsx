import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { getUserProfile } from "../api/userApi";
import type { UserProfile } from "../types/user";
import { useAuth } from "./AuthContext";

type UserContextType = {
  profile: UserProfile | null;
  loadProfile: () => Promise<void>;

};

type UserProviderProps = {
  children: ReactNode;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: UserProviderProps) {
  const { isAuth } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  async function loadProfile() {
    const userProfile = await getUserProfile();

    setProfile(userProfile);
  }

  useEffect(() => {
    if (isAuth) {
      loadProfile();
    } else {
      setProfile(null);
    }
  }, [isAuth]);



  return (
    <UserContext.Provider value={{ profile, loadProfile}}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
