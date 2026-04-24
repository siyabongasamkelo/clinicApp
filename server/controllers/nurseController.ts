// controllers/doctor.controller.ts
import type { Request, Response, NextFunction } from "express";
import { NurseService } from "../services/nurse.services.ts";

export const updateNurse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const result = await NurseService.updateNurseDetails(
      id.toString(),
      updateData,
    );

    res.status(200).json({
      message: "Nurse profile updated successfully",
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const findNurse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.body;

    const result = await NurseService.findById(id);

    res.status(200).json({
      message: "Nurse found successfully",
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

    const result = await NurseService.findByClinic(clinicId);

    res.status(200).json({
      message: "Nurses found successfully",
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
