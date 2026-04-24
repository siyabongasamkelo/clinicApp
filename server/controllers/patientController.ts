// controllers/doctor.controller.ts
import type { Request, Response, NextFunction } from "express";
import { PatientService } from "../services/patient.services.ts";

export const updatePatient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const result = await PatientService.updatePatientDetails(
      id.toString(),
      updateData,
    );

    res.status(200).json({
      message: "Patient profile updated successfully",
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const findPatient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.body;

    const result = await PatientService.findById(id);

    res.status(200).json({
      message: "Patient found successfully",
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const findByClinic = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { clinicId } = req.body;

    const result = await PatientService.findByClinic(clinicId);

    res.status(200).json({
      message: "Patients found successfully",
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
