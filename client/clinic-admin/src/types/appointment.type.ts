// src/types/auth.types.ts

export type Status =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no-show";

export interface Appointment {
  patientId: string;
  appointmentDate: Date;
  doctorId: string;
  sessionId: number;
  status: Status;
  reasonForVisit: string; // Optional: In case you scale to multiple clinics later
  createdAt: string;
}

export interface AppointmentResponse {
  data: Appointment;
  success: string;
}

export interface AppointmentsListResponse {
  data: Appointment[];
  success: boolean | string;
}

export interface GetByDateQuery {
  date: string; // YYYY-MM-DD
}
