import api from "../api/axios.config";
import type { LoginCredentials, AuthResponse } from "../types/auth.type";

export const AuthService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post("/auth/login", credentials);

      if (response.data.user.token) {
        localStorage.setItem("token", response.data.user.token);
        // Save user object for quick access
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Let the UI handle the error message
    }
  },

  register: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post("/auth/register", credentials);

      if (response.data.message === "User successfully registered") {
        console.log("User registered successfuly");
      }
      return response.data;
    } catch (error) {
      console.error("Register failed:", error);
      throw error; // Let the UI handle the error message
    }
  },

  // NEW: Retrieves user from storage or API
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      console.error("Failed to parse user from storage", e);
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },
};
