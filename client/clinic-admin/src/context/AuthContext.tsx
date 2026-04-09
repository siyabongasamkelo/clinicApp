// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthService } from "../services/auth.services";
import type { LoginSchemaType } from "../schemas/auth.schema";

interface AuthContextType {
  user: any | null;
  login: (credentials: any) => Promise<void>;
  register: (credentials: any) => Promise<void>;
  verifyEmailRequest: (credentials: any) => Promise<void>;
  verifyEmail: (credentials: any) => Promise<void>;
  forgotPassword: (credentials: any) => Promise<void>;
  resetPassword: (credentials: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loginErrors, setLoginErrors] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const savedUser = AuthService.getCurrentUser();
      if (savedUser) setUser(savedUser);
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials: LoginSchemaType) => {
    const data = await AuthService.login(credentials);
    if (data?.status === "success") setUser(data?.data);

    console.log("testing");
    setUser(null);
    return data;
  };

  const register = async (credentials: any) => {
    const data = await AuthService.register(credentials);
    return data;
  };

  const verifyEmailRequest = async (credentials: any) => {
    const data = await AuthService.verifyEmailRequest(credentials);

    return data;
  };

  const verifyEmail = async (credentials: any) => {
    const data = await AuthService.verifyEmail(credentials);

    return data;
  };

  const forgotPassword = async (credentials: any) => {
    const data = await AuthService.forgotPassword(credentials);

    return data;
  };

  const resetPassword = async (credentials: any) => {
    const data = await AuthService.resetPassword(credentials);
    return data;
  };

  const setLoadingError = async (credentials: any) => {
    setLoginErrors(credentials);
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        verifyEmailRequest,
        verifyEmail,
        forgotPassword,
        resetPassword,
        setLoadingError,
        loginErrors,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
