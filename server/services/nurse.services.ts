import { NurseRepository } from "../repository/nurseRepository.js";
import { ApiError } from "../utils/ApiError.js";
import logger from "../utils/logger.js";
export class NurseService {
  static async updateNurseDetails(nurseId: string, updateData: any) {
    // 1. Business Logic: Prevent updating sensitive unique IDs via this route
    delete updateData.userId;
    delete updateData._id;

    // 2. Ask Repository to perform the update
    const updatedNurse = await NurseRepository.updateById(nurseId, updateData);

    if (!updatedNurse) {
      logger.error(`nurse with id: ${nurseId} does not exist`);
      throw new ApiError(404, "Nurse not found or update failed");
    }

    logger.info(`nurse with id: ${nurseId} registered successfully`);
    return updatedNurse;
  }

  static async findById(nurseId: string) {
    const nurse = await NurseRepository.findById(nurseId);

    if (!nurse) {
      logger.error(`nurse with id: ${nurseId} does not exist`);
      throw new ApiError(404, "Doctor not found");
    }

    logger.info(`nurse with id: ${nurseId} found successfully`);
    return nurse;
  }

  static async findByClinic(clinicId: string) {
    const nurse = await NurseRepository.findByClinic(clinicId);

    if (!nurse) {
      logger.error(`nurse not found in this clinic : ${clinicId}`);
      throw new ApiError(404, "No nurses found for this clinic");
    }

    logger.info(`nurses in this clinic: ${clinicId} found successfully`);
    return nurse;
  }
}
