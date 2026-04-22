import mongoose, { Schema } from "mongoose";

// 1. Sub-document for Contact & Address
const ContactSchema = new Schema(
  {
    phoneNumber: { type: String, required: true },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
  },
  { _id: false },
);

// 2. Sub-document for Professional & Clinical Info
const ProfessionalSchema = new Schema(
  {
    nursingRank: {
      type: String,
      enum: ["RN", "EN", "CNS", "NP"],
      required: true,
    },
    licenseNumber: { type: String, required: true },
    departmentAssignment: { type: String, required: true },
    triageCertified: { type: Boolean, default: false },
    canPrescribe: { type: Boolean, default: false },
    specializedSkills: [{ type: String }],
    languages: [{ type: String }],
  },
  { _id: false },
);

// 3. Sub-document for Practice & Status
const DeploymentSchema = new Schema(
  {
    clinicId: { type: Schema.Types.ObjectId, ref: "Clinic", required: true },
    supervisingDoctorId: { type: Schema.Types.ObjectId, ref: "Doctor" },
    shiftType: {
      type: String,
      enum: ["Day", "Night", "Rotational"],
      default: "Day",
    },
    isOnDuty: { type: Boolean, default: false },
  },
  { _id: false },
);

const NurseSchema = new Schema(
  {
    // THE BRIDGE: Reference to the Global User Identity
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullName: { type: String, required: true },
    nurseId: { type: String, required: true, unique: true, default: "PENDING" },
    email: { type: String, required: true, unique: true },

    // Grouped Sub-documents
    contact: ContactSchema,
    professional: ProfessionalSchema,
    deployment: DeploymentSchema,
  },
  { timestamps: true },
);

export const Nurse = mongoose.model("Nurse", NurseSchema);
