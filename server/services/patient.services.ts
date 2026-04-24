import { PatientRepository } from "../repository/patientRepository.js";
import { ApiError } from "../utils/ApiError.js";
import logger from "../utils/logger.js";
export class PatientService {
  static async updatePatientDetails(patientId: string, updateData: any) {
    // 1. Business Logic: Prevent updating sensitive unique IDs via this route
    delete updateData.userId;
    delete updateData._id;

    // 2. Ask Repository to perform the update
    const updatedPatient = await PatientRepository.updateById(
      patientId,
      updateData,
    );

    if (!updatedPatient) {
      logger.error(`nurse with id: ${patientId} does not exist`);
      throw new ApiError(404, "Patient not found or update failed");
    }

    logger.info(`nurse with id: ${patientId} registered successfully`);
    return updatedPatient;
  }

  static async findById(patientId: string) {
    const patient = await PatientRepository.findById(patientId);

    if (!patient) {
      logger.error(`patient with id: ${patientId} does not exist`);
      throw new ApiError(404, "patient not found");
    }

    logger.info(`patient with id: ${patientId} found successfully`);
    return patient;
  }

  static async findByClinic(clinicId: string) {
    const patient = await PatientRepository.findByClinic(clinicId);

    if (!patient) {
      logger.error(`patient not found in this clinic : ${clinicId}`);
      throw new ApiError(404, "No patient found for this clinic");
    }

    logger.info(`patient in this clinic: ${clinicId} found successfully`);
    return patient;
  }
}
