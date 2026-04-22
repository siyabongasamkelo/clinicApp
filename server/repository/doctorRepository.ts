// repositories/DoctorRepository.ts
import { Doctor } from "../models/doctorModel";
import { DoctorAdapter } from "../adapters/doctorAdaptor";
import { UpdateDoctorInput } from "../models/doctorModel";

export class DoctorRepository {
  static async updateById(doctorId: string, data: UpdateDoctorInput) {
    return await Doctor.findByIdAndUpdate(
      doctorId,
      { $set: data }, // $set handles the sub-document nesting correctly
      { new: true, runValidators: true },
    );
  }

  static async findById(doctorId: string) {
    const data = await Doctor.findById(doctorId);

    return data ? DoctorAdapter.toDoctorProfileResponse(data) : null;
  }

  static async findByClinic(clinicId: string) {
    // Pass an object with the key 'clinicId'
    const data = await Doctor.find({ "practice.clinicId": clinicId });

    // Use the array check we talked about earlier
    return data.length > 0 ? DoctorAdapter.toDoctorListResponse(data) : [];
  }
}
