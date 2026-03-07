// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthService } from "../services/auth.services";

interface AuthContextType {
  user: any | null;
  login: (credentials: any) => Promise<void>;
  register: (credentials: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const savedUser = AuthService.getCurrentUser();
      if (savedUser) setUser(savedUser);
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials: any) => {
    const data = await AuthService.login(credentials);
    setUser(data.user); // Update global state with the user from response
  };

  const register = async (credentials: any) => {
    const data = await AuthService.register(credentials);
    setUser(data.user); // Update global state with the user from response
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
