// src/api/axios.config.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/",
});

// REQUEST Interceptor: The "Outbound Security"
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      // Automatically injects Bearer token into every request
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// RESPONSE Interceptor: The "Inbound Security"
api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    // If the server returns 401 (Unauthorized), the session is dead
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      // Redirect to login with a query param to show a message
      window.location.href = "/login?error=session_expired";
    }
    return Promise.reject(error);
  },
);

export default api;
