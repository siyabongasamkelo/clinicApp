import mongoose, { Schema } from "mongoose";

const PatientSchema = new Schema(
  {
    patientId: { type: String, required: true, unique: true }, // e.g. PAT-9920
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactNumber: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },

    allergies: [{ type: String }],
    bloodGroup: { type: String, required: true },
    chronicConditions: [{ type: String }],
    currentMedication: [{ type: String }],

    emergencyContact: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
    },

    physicalAddress: {
      street: String,
      city: String,
      zipCode: String,
    },

    medicalAid: {
      provider: { type: String, default: "Private" },
      number: { type: String },
    },

    occupation: { type: String },

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

    nearbyClinicId: { type: Schema.Types.ObjectId, ref: "Clinic" },
    assignedDoctorId: { type: Schema.Types.ObjectId, ref: "Doctor" }, // Linked for continuity of care

    isVerified: { type: Boolean, default: false },
    lastVisitDate: { type: Date },
  },
  { timestamps: true },
);

export const Patient = mongoose.model("Patient", PatientSchema);
