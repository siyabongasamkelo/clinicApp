import mongoose, { Schema } from "mongoose";

const NurseSchema = new Schema(
  {
    fullName: { type: String, required: true },
    staffId: { type: String, required: true, unique: true },
    nurseId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contact: { type: String, required: true },
    nursingRank: {
      type: String,
      enum: ["RN", "EN", "CNS", "NP"],
      required: true,
    },
    departmentAssignment: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    triageCertified: { type: Boolean, default: false },
    shiftType: {
      type: String,
      enum: ["Day", "Night", "Rotational"],
      default: "Day",
    },
    supervisingDoctorId: { type: Schema.Types.ObjectId, ref: "Doctor" },
    specializedSkills: [{ type: String }],
    languagesSpoken: [{ type: String }],
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    clinicId: { type: Schema.Types.ObjectId, ref: "Clinic", required: true },
    isOnDuty: { type: Boolean, default: false },
    canPrescribe: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Nurse = mongoose.model("Nurse", NurseSchema);
