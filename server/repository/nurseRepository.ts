// repositories/DoctorRepository.ts
import { Nurse } from "../models/nurseModel";
import { NurseAdapter } from "../adapters/nurseAdaptor";
import { UpdateNurseInput } from "../models/nurseModel";

export class NurseRepository {
  static async updateById(nurseId: string, data: UpdateNurseInput) {
    return await Nurse.findByIdAndUpdate(
      nurseId,
      { $set: data }, // $set handles the sub-document nesting correctly
      { new: true, runValidators: true },
    );
  }

  static async findById(nurseId: string) {
    const data = await Nurse.findById(nurseId);

    return data ? NurseAdapter.toNurseProfileResponse(data) : null;
  }

  static async findByClinic(clinicId: string) {
    // Pass an object with the key 'clinicId'
    const data = await Nurse.find({ "practice.clinicId": clinicId });

    // Use the array check we talked about earlier
    return data.length > 0 ? NurseAdapter.toNurseListResponse(data) : [];
  }
}
