import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Default: If the user goes to "/", send them to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
