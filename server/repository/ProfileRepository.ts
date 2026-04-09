// repositories/AuthRepository.ts
import { Doctor } from "../models/doctorModel";
import mongoose from "mongoose";

export class ProfileRepository {
  static async getProfile(identifier: string, role: string) {
    // FInd the Profile of the user
    let profile;
    if (role === "DOCTOR") {
      profile = await Doctor.findOne({ identifier });
    }

    if (profile === null || profile === undefined) return null;

    return { profile };
  }
}
