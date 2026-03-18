import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const DoctorSchema = new Schema(
  {
    fullName: { type: String, required: true },
    staffId: { type: String, required: true, unique: true, default: "PENDING" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    specialization: [{ type: String }],
    licenseNo: { type: String, required: true },
    practicingFrom: { type: Date },
    contactNumber: { type: String, required: true },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    clinicId: { type: Schema.Types.ObjectId, ref: "Clinic", required: true },
    yearsOfExperience: { type: Number, default: 0 },
    bio: { type: String },
    profilePhoto: { type: String },
    previousExperience: [
      {
        clinicName: String,
        years: Number,
        role: String,
      },
    ],
    qualifications: [
      {
        institution: String,
        major: String,
        yearGraduated: Number,
      },
    ],
    consultationFee: { type: Number, required: true },
    timeSlotPerClient: { type: Number, default: 30 },
    languagesSpoken: [{ type: String }],
    isActive: { type: Boolean, default: true },
    averageRating: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

DoctorSchema.pre("save", async function () {
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

DoctorSchema.pre("save", async function () {
  if (!this.isNew) return; // Only run when creating a new patient

  // Generate a random or sequential ID (e.g., PAT-8372)
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  this.staffId = `PAT-${randomDigits}`;
});

export const Doctor = mongoose.model("Doctor", DoctorSchema);
