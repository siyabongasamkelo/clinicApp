// repositories/DoctorRepository.ts
import { Clinic } from "../models/clinicModel";
import { ClinicAdapter } from "../adapters/clinicAdaptor";
import { ClinicType } from "../models/clinicModel";

export class ClinicRepository {
  static async createClinic(clinicData: ClinicType) {
    return await Clinic.create(clinicData);
  }

  static async updateById(clinicId: string, data: ClinicType) {
    return await Clinic.findByIdAndUpdate(
      clinicId,
      { $set: data }, // $set handles the sub-document nesting correctly
      { new: true, runValidators: true },
    );
  }

  static async findById(clinicId: string) {
    const data = await Clinic.findById(clinicId);

    return data ? ClinicAdapter.toClinicProfileResponse(data) : null;
  }

  static async findByName(clinicName: string) {
    const data = await Clinic.find({ name: clinicName });

    return data.length > 0 ? ClinicAdapter.toClinicListResponse(data) : [];
  }

  static async findByTown(townName: string) {
    const data = await Clinic.find({ "address.town": townName });

    return data.length > 0 ? ClinicAdapter.toClinicListResponse(data) : [];
  }

  static async findByProvince(provinceName: string) {
    const data = await Clinic.find({ "address.province": provinceName });

    return data.length > 0 ? ClinicAdapter.toClinicListResponse(data) : [];
  }
}
