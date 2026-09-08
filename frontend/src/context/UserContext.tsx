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
  updateTotalScore: (points: number) => void;
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

  function updateTotalScore(points: number) {
    setProfile((currentProfile) => {
      if (!currentProfile) {
        return null;
      }

      return {
        ...currentProfile,
        totalScore: currentProfile.totalScore + points,
      };
    });
  }

  return (
    <UserContext.Provider value={{ profile, loadProfile, updateTotalScore }}>
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
