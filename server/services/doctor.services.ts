import { DoctorRepository } from "../repository/doctorRepository.js";
import { ApiError } from "../utils/ApiError.js";
import logger from "../utils/logger.js";
export class DoctorService {
  static async updateDoctorDetails(doctorId: string, updateData: any) {
    // 1. Business Logic: Prevent updating sensitive unique IDs via this route
    delete updateData.userId;
    delete updateData._id;

    // 2. Ask Repository to perform the update
    const updatedDoctor = await DoctorRepository.updateById(
      doctorId,
      updateData,
    );

    if (!updatedDoctor) {
      logger.error(`doctor with id: ${doctorId} does not exist`);
      throw new ApiError(404, "Doctor not found or update failed");
    }

    logger.info(`doctor with id: ${doctorId} registered successfully`);
    return updatedDoctor;
  }

  static async findById(doctorId: string) {
    const doctor = await DoctorRepository.findById(doctorId);

    if (!doctor) {
      logger.error(`doctor with id: ${doctorId} does not exist`);
      throw new ApiError(404, "Doctor not found");
    }

    logger.info(`doctor with id: ${doctorId} found successfully`);
    return doctor;
  }

  static async findByClinic(clinicId: string) {
    const doctor = await DoctorRepository.findByClinic(clinicId);

    if (!doctor) {
      logger.error(`doctors not found in this clinic : ${clinicId}`);
      throw new ApiError(404, "No doctors found for this clinic");
    }

    logger.info(`doctors in this clinic: ${clinicId} found successfully`);
    return doctor;
  }
}
