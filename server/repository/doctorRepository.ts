// repositories/DoctorRepository.ts
import { Doctor } from "../models/Doctor";

export class DoctorRepository {
  static async updateProfile(userId: string, updateData: IDoctorUpdateInput) {
    // We use findOneAndUpdate to find the profile linked to the Auth User
    const updatedProfile = await Doctor.findOneAndUpdate(
      { userId },
      { $set: updateData }, // Mongoose handles the nested object merging safely
      { new: true, runValidators: true },
    );

    return updatedProfile;
  }
}
