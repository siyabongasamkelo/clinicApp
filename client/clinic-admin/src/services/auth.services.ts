import api from "../api/axios.config";
import type {
  LoginCredentials,
  AuthResponse,
  VerifyEmailRequestCredentials,
  RegisterCredentials,
  VerifyEmailCredentials,
  ResetPasswordCredentials,
} from "../types/auth.type";

export const AuthService = {
  doctorLogin: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post("/auth/login/doctor", credentials, {
        skipInterceptor: true,
      } as any);

      if (response.data.status === "success") {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response?.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  nurseLogin: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post("/auth/login/nurse", credentials);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  //------------------------------Register functions------------------------------//

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post("/auth/register", credentials);

      return response.data;
    } catch (error) {
      console.error("Register failed:", error);
      throw error; // Let the UI handle the error message
    }
  },

  verifyEmailRequest: async (
    credentials: VerifyEmailRequestCredentials,
  ): Promise<AuthResponse> => {
    try {
      const response = await api.post(
        "/auth/verify-email-request",
        credentials,
      );

      if (
        response.data.message ===
        "If an account exists for this email, a verification link has been sent."
      ) {
        console.log("Email verification request successfully sent");
      }
      return response.data;
    } catch (error) {
      console.error("Email verification request failed:", error);
      throw error; // Let the UI handle the error message
    }
  },

  verifyEmail: async (
    credentials: VerifyEmailCredentials,
  ): Promise<AuthResponse> => {
    try {
      const response = await api.post("/auth/forgot-password", credentials);

      if (response.data.message === "Email successfully verified.") {
        console.log("Email verified successfully");
      }
      return response.data;
    } catch (error) {
      console.error("Email verification failed:", error);
      throw error;
    }
  },

  forgotPassword: async (
    credentials: VerifyEmailRequestCredentials,
  ): Promise<AuthResponse> => {
    try {
      const response = await api.post("/auth/forgot-password", credentials);

      if (response.data.message === "Reset link sent to email.") {
        console.log("Reset link sent to email.");
      }
      return response.data;
    } catch (error) {
      console.error("Failed to create reset link.", error);
      throw error;
    }
  },

  resetPassword: async (
    credentials: ResetPasswordCredentials,
  ): Promise<AuthResponse> => {
    try {
      const response = await api.post("/auth/reset-password", credentials);

      if (
        response.data.message ===
        "Password updated successfully. You can now log in."
      ) {
        console.log("Password updated successfully. You can now log in.");
      }
      return response.data;
    } catch (error) {
      console.error("Failed to reset password", error);
      throw error;
    }
  },

  // NEW: Retrieves user from storage or API
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem("user");

      // Check for the STRING "undefined" or "null" which localStorage creates
      if (!userStr || userStr === "undefined" || userStr === "null") {
        return null;
      }

      return JSON.parse(userStr);
    } catch (e) {
      console.error("Failed to parse user from storage", e);
      // If it's corrupted, just wipe it so it doesn't crash again
      localStorage.removeItem("user");
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },
};
