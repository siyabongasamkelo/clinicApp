import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const PatientSchema = new Schema(
  {
    patientId: {
      type: String,
      required: true,
      unique: true,
      default: "PENDING",
    }, // e.g. PAT-9920
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
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

PatientSchema.pre("save", async function () {
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

PatientSchema.pre("save", async function () {
  if (!this.isNew) return; // Only run when creating a new patient

  // Generate a random or sequential ID (e.g., PAT-8372)
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  this.patientId = `PAT-${randomDigits}`;
});

export type PatientType = mongoose.InferSchemaType<typeof PatientSchema>;

export const Patient = mongoose.model("Patient", PatientSchema);
