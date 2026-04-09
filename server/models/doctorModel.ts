import mongoose, { Schema } from "mongoose";

// Sub-document for Contact & Address
const ContactSchema = new Schema(
  {
    phoneNumber: { type: String },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
  },
  { _id: false },
);

// Sub-document for Practice Details
const PracticeSchema = new Schema(
  {
    clinicId: { type: Schema.Types.ObjectId, ref: "Clinic" },
    consultationFee: { type: Number },
    timeSlotPerClient: { type: Number, default: 30 },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { _id: false },
);

// Sub-document for Education & Experience
const BackgroundSchema = new Schema(
  {
    qualifications: [
      {
        institution: String,
        major: String,
        yearGraduated: Number,
      },
    ],
    previousExperience: [
      {
        clinicName: String,
        years: Number,
        role: String,
      },
    ],
    languagesSpoken: [{ type: String }],
    bio: { type: String },
  },
  { _id: false },
);

const DoctorSchema = new Schema(
  {
    // THE BRIDGE: Reference to the Global User Identity
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullName: { type: String, required: true },
    profilePhoto: { type: String },

    // Grouped Sub-documents
    contact: ContactSchema,
    practice: PracticeSchema,
    background: BackgroundSchema,

    // Professional stats
    professional: {
      specialization: [{ type: String }],
      licenseNo: { type: String },
      practicingFrom: { type: Date },
      yearsOfExperience: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

export const Doctor = mongoose.model("Doctor", DoctorSchema);
