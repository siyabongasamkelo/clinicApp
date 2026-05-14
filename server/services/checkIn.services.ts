import { CheckInRepository } from "../repository/checkInRepository.js";
import { ApiError } from "../utils/ApiError.js";
import logger from "../utils/logger.js";

export class CheckInService {
  static async create(checkInData: any) {
    const checkIn = await CheckInRepository.create(checkInData);

    if (!checkIn) {
      logger.error(`Could not record check-in for user: ${checkInData.userId}`);
      throw new ApiError(400, "Check-in failed");
    }

    logger.info(
      `User ${checkInData.userId} checked into clinic ${checkInData.clinicId}`,
    );
    return checkIn;
  }

  static async findByClinicId(clinicId: string) {
    const checkIns = await CheckInRepository.findByClinicId(clinicId);

    if (!checkIns || checkIns.length === 0) {
      logger.warn(`No check-ins found for clinic ID: ${clinicId}`);
      throw new ApiError(404, "No check-ins found for this clinic");
    }

    logger.info(`Retrieved check-ins for clinic: ${clinicId}`);
    return checkIns;
  }

  static async deleteByUserId(userId: string) {
    const result = await CheckInRepository.deleteByUserId(userId);

    if (!result) {
      logger.error(`Failed to delete check-ins for user: ${userId}`);
      throw new ApiError(404, "Check-in records not found or already deleted");
    }

    logger.info(`Deleted all check-in records for user: ${userId}`);
    return "Check-in history cleared successfully";
  }
}
