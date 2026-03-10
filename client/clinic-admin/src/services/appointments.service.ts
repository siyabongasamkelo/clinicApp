import api from "../api/axios.config";
import type {
  AppointmentResponse,
  getByDateQuery,
} from "../types/appointment.type";

export const AppointmentService = {
  getAllAppointments: async (
    credentials: any,
  ): Promise<AppointmentResponse> => {
    try {
      const response = await api.get("/api/appointments/getAll", credentials);

      if (response?.data?.data?.appointments) {
        // localStorage.setItem("token", response.data.data.appointments);
        // Save user object for quick access
        localStorage.setItem(
          "allAppointments",
          JSON.stringify(response?.data?.data?.appointments),
        );
      }
      return response?.data;
    } catch (error) {
      console.error("Getting all appointments failed:", error);
      throw error; // Let the UI handle the error message
    }
  },
  getAppointmentsByDate: async (
    credentials: getByDateQuery,
  ): Promise<AppointmentResponse> => {
    try {
      const response = await api.get("/api/appointments/appointments", {
        params: credentials,
      });
      console.log("services appointment :", response.data);
      return response?.data;
    } catch (error) {
      console.error("Getting appointments by date failed:", error);
      throw error; // Let the UI handle the error message
    }
  },
};
