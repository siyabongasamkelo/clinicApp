import express from "express";
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
    const patientId: string = req.user?.id;
    const { appointmentDate, sessionId, reason } = req.body;

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

export const getAppointmentsByDate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { date } = req.query as { date?: string };

    if (!date) {
      return next(
        new ApiError(
          400,
          "Missing required 'date' query parameter in format YYYY-MM-DD",
        ),
      );
    }

    const startOfDay = new Date(date);
    if (isNaN(startOfDay.getTime())) {
      return next(new ApiError(400, "Invalid date format. Use YYYY-MM-DD"));
    }

    // Calculate next day for exclusive upper bound
    const nextDay = new Date(startOfDay);
    nextDay.setDate(startOfDay.getDate() + 1);

    const appointments = await Appointment.find({
      appointmentDate: { $gte: startOfDay, $lt: nextDay },
    }).populate("patientId");

    if (!appointments) {
      return next(new ApiError(404, "No appointments found."));
    }

    return res.status(200).json({ success: true, data: appointments });
  } catch (err) {
    console.error("GetAppointmentByDate Error:", err);
    return next(new ApiError(500, "An unexpected error occurred."));
  }
};

export const getAllAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const appointments = await Appointment.find().populate("patientId");
    return res.status(200).json({ success: true, data: appointments });
  } catch (err) {
    next(err);
  }
};

export const getSingleAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id).populate("patientId");
    return res.status(200).json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};

export const updateSingleAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};

export const deleteSingleAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndDelete(id);
    return res.status(200).json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};
