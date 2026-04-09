// repositories/UserRepository.ts
import { User } from "../models/userModel";
// import { Nurse } from '../models/Nurse';
import { DoctorAdapter, UserAdapter } from "../adapters/userAdapter";

export class UserRepository {
  static async getUserProfile(userId: string, role: string) {
    if (role === "DOCTOR") {
      const data = await Doctor.findOne({ userId });
      return data ? new DoctorAdapter(data) : null;
    }
    // if (role === 'NURSE') {
    //   const data = await Nurse.findOne({ userId });
    //   return data ? new NurseAdapter(data) : null;
    // }
    return null;
  }

  static async findByIdentifier(userId: string) {
    const data = await User.findOne({ userId });

    return data ? new UserAdapter(data) : null;
    // return data;
    // if (role === 'NURSE') {
    //   const data = await Nurse.findOne({ userId });
    //   return data ? new NurseAdapter(data) : null;
    // }
  }

  static async findByEmail(email: string) {
    const data = await User.findOne({ email });

    return data ? new UserAdapter(data) : null;
    // return data;
    // if (role === 'NURSE') {
    //   const data = await Nurse.findOne({ userId });
    //   return data ? new NurseAdapter(data) : null;
    // }
  }

  static async findById(id: string) {
    const data = await User.findById(id);

    return data ? new UserAdapter(data) : null;
    // return data;
    // if (role === 'NURSE') {
    //   const data = await Nurse.findOne({ userId });
    //   return data ? new NurseAdapter(data) : null;
    // }
  }

  // user.repository.ts
  static async updatePassword(
    id: string,
    hashedPass: string,
  ): Promise<boolean> {
    const result = await User.updateOne(
      { _id: id },
      { $set: { password: hashedPass } },
    );
    return result.modifiedCount > 0;
  }

  static async verifyAccount(id: string): Promise<boolean> {
    const result = await User.updateOne(
      { _id: id },
      { $set: { isVerified: true } },
    );
    return result.modifiedCount > 0;
  }
}
