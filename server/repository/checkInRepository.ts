import { CheckIn } from "../models/checkInModel.js";
import logger from "../utils/logger.js";

export class CheckInRepository {
  static async create(checkInData: any) {
    try {
      return await CheckIn.create(checkInData);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error(`Error in Repository create:: ${errorMessage}`);
      return null;
    }
  }

  static async findByClinicId(clinicId: string) {
    try {
      return await CheckIn.find({ clinicId } as any)
        .populate("userId")
        .sort({ checkInTime: -1 });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error(`Error in Repository findByClinicId: ${errorMessage}`);
      return null;
    }
  }

  static async deleteByUserId(userId: string) {
    try {
      // This deletes all check-in history for that specific user
      const result = await CheckIn.deleteMany({ userId: userId as any });
      return result.deletedCount > 0;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error(`Error in Repository deleteByUserId: ${errorMessage}`);
      return false;
    }
  }
}
