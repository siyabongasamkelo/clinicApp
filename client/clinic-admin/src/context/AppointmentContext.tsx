// src/context/AppointmentContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";
import { AppointmentService } from "../services/appointments.service";
import type {
  Appointment,
  AppointmentResponse,
} from "../types/appointment.type";

interface AppointmentContextType {
  appointments: Appointment[];
  todaysAppointments: Appointment[];
  getAllAppointments: () => Promise<void>;
  getAppointmentsByDate: (credentials: { date: string }) => Promise<void>;
  loading: boolean;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(
  undefined,
);

export const AppointmentProvider = ({ children }: { children: ReactNode }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [todaysAppointments, setTodaysAppointments] = useState<Appointment[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  const getAllAppointments = async (): Promise<void> => {
    const data = await AppointmentService.getAllAppointments();
    setAppointments(data?.data);
  };

  const getAppointmentsByDate = async (credentials: { date: string }) => {
    const data = await AppointmentService.getAppointmentsByDate(credentials);
    setTodaysAppointments(data);
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        todaysAppointments,
        getAllAppointments,
        getAppointmentsByDate,
        loading,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context)
    throw new Error(
      "useAppointments must be used within an AppointmentProvider",
    );
  return context;
};
