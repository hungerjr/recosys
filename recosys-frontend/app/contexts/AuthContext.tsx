"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/axios"; // Import our configured axios instance

// Defines the shape of a user object in our application
type User = {
  id: string;
  name: string;
  email: string;
};

// Defines the shape of the data and functions our context will provide
interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Create the context with an initial undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The AuthProvider component will wrap our entire app
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // This effect runs once when the app loads to check for a valid session
  useEffect(() => {
    const verifyUserSession = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        console.log("Found token, verifying session with the /me endpoint...");

        const useDummyApi = process.env.NEXT_PUBLIC_USE_DUMMY_API === "true";

        if (useDummyApi) {
          // --- DUMMY TOKEN VERIFICATION ---
          setTimeout(() => {
            setUser({
              id: "user-123",
              name: "Vaidik Jaiswal",
              email: "vaidik@recosys.com",
            });
            setIsLoading(false);
          }, 500);
        } else {
          // --- REAL TOKEN VERIFICATION ---
          try {
            // The axios interceptor will automatically add the token to this request
            const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await API.get(base_url + "/user/me");
            console.log("status code:", response.status);
            setUser(response.data); // Set the user based on the backend's response
            // console.log("User session verified:", response.data);
          } catch (error) {
            console.error("Session verification failed:", error);
            // If the /me call fails, the token is invalid. Log the user out.
            logout();
          } finally {
            setIsLoading(false);
          }
        }
      } else {
        setIsLoading(false); // No token found, not logged in.
      }
    };

    verifyUserSession();
  }, []);

  // Function to handle logging in
  const login = (token: string, userData: User) => {
    localStorage.setItem("authToken", token);
    setUser(userData);
  };

  // Function to handle logging out
  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    router.push("/login");
  };

  // A derived boolean to easily check if a user is logged in
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoading, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// A custom hook to easily access the auth context in any component
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
