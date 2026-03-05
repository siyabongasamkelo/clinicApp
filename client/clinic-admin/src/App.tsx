import { Routes, Route, Navigate } from "react-router-dom";
// Import your components (we will create these files next)
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Private/Admin Route (Placeholder) */}
      <Route path="/admin" element={<AdminDashboard />} />

      {/* Default: If the user goes to "/", send them to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
