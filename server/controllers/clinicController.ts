// controllers/doctor.controller.ts
import type { Request, Response, NextFunction } from "express";
import { ClinicService } from "../services/clinic.services.ts";
import { CheckInService } from "../services/checkIn.services.ts";
import { QrService } from "../services/qrCode.services.ts";

export const createClinic = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const clinicData = req.body;

    const result = await ClinicService.creteClinic(clinicData);

    res.status(200).json({
      message: "Clinic profile created successfully",
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const updateClinic = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const result = await ClinicService.updateClinicDetails(
      id.toString(),
      updateData,
    );

    res.status(200).json({
      message: "Clinic profile updated successfully",
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.body;
    const result = await ClinicService.findById(id);

    res.status(200).json({
      message: "Clinic found successfully",
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const findByName = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { clinicName } = req.body;

    const result = await ClinicService.findByName(clinicName);

    res.status(200).json({
      message: "clinic found successfully",
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const findByTown = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { town } = req.body;

    const result = await ClinicService.findByName(town);

    res.status(200).json({
      message: "clinics found successfully",
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getClinicQr = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const qrImage = await QrService.generateClinicQr(id as string);
    return res.status(200).json({ success: true, qrImage });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error generating QR" });
  }
};

export const verifyCheckIn = async (req: Request, res: Response) => {
  const { scannedId, userId } = req.body;
  try {
    const clinic = await ClinicService.findById(scannedId);

    if (!clinic) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Clinic QR" });
    }

    // Logic to record the check-in in your DB
    await CheckInService.create({ userId, clinicId: clinic.id });

    return res.status(200).json({
      success: true,
      message: `Checked into ${clinic.name}`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Verification failed" });
  }
};
