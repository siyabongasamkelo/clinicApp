// repositories/AuthRepository.ts
import { User } from "../models/userModel";
import { Doctor } from "../models/doctorModel";
import bcrypt from "bcrypt";
import { Nurse } from "../models/nurseModel";
import { Patient } from "../models/patientModel";
import { UserRepository } from "../repository/userRepository";
import { UserLightRegisterSchema } from "../validation/auth.schema.ts";

import mongoose from "mongoose";

export class AuthRepository {
  static async createInitialAccount(data: UserLightRegisterSchema["body"]) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Create Identity
      const [newUser] = await User.create(
        [
          {
            email: data.email,
            password: data.password,
            role: data.role,
          },
        ],
        { session },
      );

      // 2. Create Shell Profile based on Role
      let profile;
      if (data.role === "DOCTOR") {
        [profile] = await Doctor.create(
          [
            {
              userId: newUser._id,
              fullName: data.fullName,
            },
          ],
          { session },
        );
      }

      if (data.role === "NURSE") {
        [profile] = await Nurse.create(
          [
            {
              userId: newUser._id,
              fullName: data.fullName,
            },
          ],
          { session },
        );
      }

      if (data.role === "PATIENT") {
        [profile] = await Patient.create(
          [
            {
              userId: newUser._id,
              fullName: data.fullName,
            },
          ],
          { session },
        );
      }

      await session.commitTransaction();
      return newUser;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async login(identifier: string, password: string) {
    // 1. Find the Identity (Global User)
    const user = await User.findOne({ identifier });
    if (!user) return null;

    // 2. Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    // 3. Fetch the Profile using our existing Repository Pattern

    const profile = await UserRepository.getUserProfile(
      user._id.toString(),
      user.role,
    );

    return { user, profile };
  }
}
