// src/api/axios.config.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/",
  validateStatus: (status) => status < 500,
  timeout: 10000,
});

// REQUEST Interceptor: The "Outbound Security"
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. Check if the error happened on an AUTH route
    // (We don't want to redirect if a login/register attempt fails)
    const isAuthRoute = error.config?.url?.includes("/auth");

    if (error.response && error.response.status === 401) {
      // 2. Only redirect if it's NOT an auth route
      if (!isAuthRoute) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login?error=session_expired";
      }
    }

    // 3. ALWAYS reject so the .catch() in your useLoginForm runs
    return Promise.reject(error);
  },
);

// RESPONSE Interceptor: The "Inbound Security"
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginPage = window.location.pathname === "/login";

    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");

      // ONLY redirect if we aren't already on the login page
      if (!isLoginPage) {
        window.location.href = "/login?error=session_expired";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
