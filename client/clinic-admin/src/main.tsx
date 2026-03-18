import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "styled-components";
import { appTheme } from "./styles/Theme";
import { AuthProvider } from "./context/AuthContext";
import { AppointmentProvider } from "./context/AppointmentContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

// Add these if you installed @fontsource/roboto

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider theme={appTheme}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />

      <AppointmentProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </AppointmentProvider>
    </ThemeProvider>
  </BrowserRouter>,
);
