"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { auth as appAuth } from "@/lib/firebase/firebaseClient";
import {
  Auth,
  onAuthStateChanged,
  User,
  signOut as firebaseSignOut,
} from "firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    setAuth(appAuth);
  }, []);

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const signOut = async () => {
    if (!auth) {
      console.error("Firebase Auth not initialized.");
      return;
    }
    setLoading(true); // Optional: Set loading state while signing out
    try {
      await firebaseSignOut(auth);
      console.log("User signed out successfully.");
    } catch (error) {
      console.error("Error signing out:", error);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
