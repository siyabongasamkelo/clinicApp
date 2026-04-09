import { Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import VerifyYourAccountPage from "./pages/VerifyYourAccountPage";
import LoginPage from "./pages/loginPage";
import VerifyAccountPage from "./pages/VerifyAccountPage";
import VerifyEmailRequestPage from "./pages/VerificationEmailRequestPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-your-account" element={<VerifyYourAccountPage />} />
      <Route path="/auth/confirmemail" element={<VerifyAccountPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route
        path="/auth/reset-password/:id/:token"
        element={<UpdatePasswordPage />}
      />
      <Route
        path="/verify-email-request"
        element={<VerifyEmailRequestPage />}
      />

      {/* Default: If the user goes to "/", send them to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
