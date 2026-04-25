import { ClinicRepository } from "../repository/clinicRepository.js";
import { ApiError } from "../utils/ApiError.js";
import logger from "../utils/logger.js";
import { ClinicType } from "../models/clinicModel.js";
export class ClinicService {
  static async creteClinic(clinicData: ClinicType) {
    const createClinic = await ClinicRepository.createClinic(clinicData);

    if (!createClinic) {
      logger.error(`could not create clinic profile`);
      throw new ApiError(404, "could not create clinic profile");
    }

    logger.info(`clinic profile created successfully`);
    return "clinic created successfully";
  }

  static async updateClinicDetails(clinicId: string, updateData: any) {
    // 1. Business Logic: Prevent updating sensitive unique IDs via this route
    delete updateData.userId;
    delete updateData._id;

    // 2. Ask Repository to perform the update
    const updatedClinic = await ClinicRepository.updateById(
      clinicId,
      updateData,
    );

    if (!updatedClinic) {
      logger.error(`clinic with id: ${clinicId} does not exist`);
      throw new ApiError(404, "Clinic not found or update failed");
    }

    logger.info(`clinic with id: ${clinicId} registered successfully`);
    return updatedClinic;
  }

  static async findById(clinicId: string) {
    const clinic = await ClinicRepository.findById(clinicId);

    if (!clinic) {
      logger.error(`clinic with id: ${clinicId} does not exist`);
      throw new ApiError(404, "clinic not found");
    }

    logger.info(`clinic with id: ${clinicId} found successfully`);
    return clinic;
  }

  static async findByTown(townName: string) {
    const clinics = await ClinicRepository.findByTown(townName);

    if (!clinics) {
      logger.error(`There are no clinics in: ${townName}.`);
      throw new ApiError(404, "no clinics found");
    }

    logger.info(`clinics in this town found: ${townName} found successfully`);
    return clinics;
  }

  static async findByName(clinicName: string) {
    const clinic = await ClinicRepository.findByName(clinicName);

    if (!clinic) {
      logger.error(`Clinic with this name not found: ${clinicName}.`);
      throw new ApiError(404, "clinic not found.");
    }

    logger.info(
      `clinic with this name found: ${clinicName} found successfully`,
    );
    return clinic;
  }
}
