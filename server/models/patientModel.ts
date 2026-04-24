import mongoose, { Schema } from "mongoose";

// 1. Sub-document for Medical Background
const MedicalHistorySchema = new Schema(
  {
    bloodGroup: { type: String, required: true },
    allergies: [{ type: String }],
    chronicConditions: [{ type: String }],
    currentMedication: [{ type: String }],
  },
  { _id: false },
);

// 2. Sub-document for Insurance/Medical Aid
const InsuranceSchema = new Schema(
  {
    provider: { type: String, default: "Private" },
    policyNumber: { type: String }, // Renamed 'number' to 'policyNumber' for clarity
  },
  { _id: false },
);

// 3. Sub-document for Emergency & Lifestyle
const PersonalDetailsSchema = new Schema(
  {
    occupation: { type: String },
    emergencyContact: {
      name: { type: String },
      phone: { type: String },
    },
    lifestyle: {
      smokingStatus: {
        type: String,
        enum: ["Smoker", "Non-Smoker", "Former Smoker"],
      },
      alcoholConsumption: {
        type: String,
        enum: ["None", "Occasional", "Frequent"],
      },
    },
  },
  { _id: false },
);

const PatientSchema = new Schema(
  {
    // THE BRIDGE: Reference to the Global User Identity
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullName: { type: String, required: true },
    email: { type: String, unique: true },
    contactNumber: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other"] },

    // Grouped Sub-documents
    medicalHistory: MedicalHistorySchema,
    insurance: InsuranceSchema,
    personal: PersonalDetailsSchema,

    address: {
      street: String,
      city: String,
      zipCode: String,
    },

    // Clinical Context
    clinicContext: {
      nearbyClinicId: { type: Schema.Types.ObjectId, ref: "Clinic" },
      assignedDoctorId: { type: Schema.Types.ObjectId, ref: "Doctor" },
      lastVisitDate: { type: Date },
    },

    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type PatientType = mongoose.InferSchemaType<typeof PatientSchema>;
export const Patient = mongoose.model("Patient", PatientSchema);

export type PatientDocument = mongoose.InferSchemaType<typeof PatientSchema>;
export type UpdatePatientInput = Partial<PatientDocument>;
