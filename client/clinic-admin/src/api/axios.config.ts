// src/api/axios.config.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/",
  timeout: 10000,
  validateStatus: () => true,
});

// REQUEST Interceptor: Use this for adding Tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RESPONSE Interceptor: Handle Global Errors (401, 500, etc.)
api.interceptors.response.use(
  (response) => response, // Status 2xx
  (error) => {
    const status = error.response?.status;
    const path = window.location.pathname;

    // 1. Handle Session Expiry (401)
    if (status === 401) {
      const isAuthPage = path === "/login" || path === "/register";

      // Don't redirect if the user is ALREADY trying to log in/register
      if (!isAuthPage) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login?error=session_expired";
      }
    }

    // 2. Global Error Logging (Optional)
    if (status >= 500) {
      console.error("Server Error: Contact Backend Team");
    }

    // 3. CRITICAL: Pass the error back to your Service/Controller
    return Promise.reject(error);
  },
);

export default api;
