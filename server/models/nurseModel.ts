import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const NurseSchema = new Schema(
  {
    fullName: { type: String, required: true },
    nurseId: { type: String, required: true, unique: true, default: "PENDING" },
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
    languages: [{ type: String }],
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

NurseSchema.pre("save", async function () {
  // 'this' refers to the document being saved
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // No need to call next() here!
  } catch (error: any) {
    // Re-throw the error so Mongoose catches it
    throw error;
  }
});

NurseSchema.pre("save", async function () {
  if (!this.isNew) return; // Only run when creating a new patient

  // Generate a random or sequential ID (e.g., PAT-8372)
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  this.nurseId = `PAT-${randomDigits}`;
});

export const Nurse = mongoose.model("Nurse", NurseSchema);
