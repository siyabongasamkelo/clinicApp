// repositories/DoctorRepository.ts
import { Patient } from "../models/patientModel";
import { PatientAdapter } from "../adapters/patientAdaptor";
import { UpdatePatientInput } from "../models/patientModel";

export class PatientRepository {
  static async updateById(patientId: string, data: UpdatePatientInput) {
    return await Patient.findByIdAndUpdate(
      patientId,
      { $set: data }, // $set handles the sub-document nesting correctly
      { new: true, runValidators: true },
    );
  }

  static async findById(patientId: string) {
    const data = await Patient.findById(patientId);

    return data ? PatientAdapter.toPatientProfileResponse(data) : null;
  }

  static async findByClinic(clinicId: string) {
    // Pass an object with the key 'clinicId'
    const data = await Patient.find({ "practice.clinicId": clinicId });

    // Use the array check we talked about earlier
    return data.length > 0 ? PatientAdapter.toPatientListResponse(data) : [];
  }
}
