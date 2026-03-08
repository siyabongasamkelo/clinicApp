import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailRequest from "./pages/VerifyEmailRequestPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email-request" element={<VerifyEmailRequest />} />
      <Route path="/auth/confirmemail" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route
        path="/auth/reset-password/:userId/:token"
        element={<ResetPasswordPage />}
      />

      {/* Private/Admin Route (Placeholder) */}
      <Route path="/admin" element={<AdminDashboard />} />

      {/* Default: If the user goes to "/", send them to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
