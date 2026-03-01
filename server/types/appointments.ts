import { Request } from "express";

export interface CreateAppointmentRequest extends Request {
  body: {
    patientId: string;
    doctorId: string;
    appointmentDate: string;
    sessionId: number;
    reason: string;
  };
}

export interface UpdateStatusRequest extends Request {
  params: {
    id: string;
  };
  body: {
    status: "pending" | "confirmed" | "completed" | "cancelled" | "no-show";
  };
}
