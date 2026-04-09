// controllers/doctor.controller.ts
import { DoctorRepository } from "../repository/doctorRepository";
import { DoctorAdapter } from "../adapters/doctorAdaptor";

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id; // From your Auth Middleware

    // 1. Adapt/Clean the incoming data
    const updateData = DoctorAdapter.toUpdateFormat(req.body);

    // 2. Perform the update via Repository
    const profile = await DoctorRepository.updateProfile(userId, updateData);

    if (!profile) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    res.json({ message: "Profile updated successfully!", profile });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
