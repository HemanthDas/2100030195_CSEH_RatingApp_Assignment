import { createContext, useState, useEffect, ReactNode, useMemo } from "react";
import { fetcher } from "../utils/api";
import { jwtDecode } from "jwt-decode";

interface User {
  id: number;
  role: "admin" | "user" | "store_owner";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { readonly children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode<User & { exp: number }>(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp < currentTime) {
        console.warn("Token expired. Logging out...");
        logout();
      } else {
        setUser({ id: decoded.id, role: decoded.role });
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await fetcher<{ token: string; user: User }>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        },
        logout
      );

      localStorage.setItem("token", data.token);
      setUser(data.user);
      return true;
    } catch {
      return false;
    }
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider, AuthContext };
