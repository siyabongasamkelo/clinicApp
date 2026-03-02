import express from "express";
// Using 'import type' ensures Jest doesn't look for these in the Express JS code
import type { Request, Response, NextFunction } from "express";

import { Appointment } from "../models/appointmentModel.js";
import { SESSION_MAP, CLINIC_CONFIG } from "../config/clinicConfig.js";
import logger from "../utils/logger.js";
import type {
  CreateAppointmentRequest,
  UpdateStatusRequest,
} from "../types/appointments.type.js";
import { userModel } from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";

export const createAppointment = async (
  req: CreateAppointmentRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const patientId = req.user?.id;
    const { appointmentDate, sessionId, reason } = req.body;

    // TypeScript now knows 'sessionId' is a number!
    const validSession = SESSION_MAP.find((s) => s.id === sessionId);
    if (!validSession) {
      //   return res.status(400).json({ message: "Invalid session." });
      return next(new ApiError(400, "Invalid session."));
    }

    const currentBookings = await Appointment.countDocuments({
      appointmentDate: new Date(appointmentDate),
      sessionId,
    });

    if (currentBookings >= CLINIC_CONFIG.DEFAULT_MAX_PATIENTS_PER_SESSION) {
      //   return res.status(409).json({ message: "Session full." });
      return next(new ApiError(409, "Session full."));
    }

    const newAppointment = await Appointment.create({
      patientId,
      appointmentDate: new Date(appointmentDate),
      sessionId,
      reasonForVisit: reason,
    });

    return res.status(201).json({ success: true, data: newAppointment });
  } catch (err) {
    next(err);
  }
};

export const updateAppointmentStatus = async (
  req: UpdateStatusRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;

    const user = await userModel.findById(userId);

    if (user?.role === "patient" || !user) {
      //   return res.status(403).json({ message: "Forbidden." });
      return next(new ApiError(403, "Forbidden."));
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );

    if (!appointment) {
      //   return res.status(404).json({ message: "Not found." });
      return next(new ApiError(404, "Not found."));
    }

    logger.info(`STATUS_UPDATE: ${id} to ${status}`);
    return res.status(200).json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};
