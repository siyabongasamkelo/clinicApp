// controllers/doctor.controller.ts
import type { Request, Response, NextFunction } from "express";
import { DoctorService } from "../services/doctor.services.ts";

export const updateDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const result = await DoctorService.updateDoctorDetails(
      id.toString(),
      updateData,
    );

    res.status(200).json({
      message: "Doctor profile updated successfully",
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const findDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.body;
    const result = await DoctorService.findById(id);

    res.status(200).json({
      message: "Doctor found successfully",
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

    const result = await DoctorService.findByClinic(clinicId);

    res.status(200).json({
      message: "Doctors found successfully",
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
