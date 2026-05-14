import mongoose, { Schema } from "mongoose";

// Operational Hours (Clean for UI scheduling)
const OperatingHoursSchema = new Schema(
  {
    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },
    open: { type: String }, // e.g., "08:00"
    close: { type: String }, // e.g., "17:00"
    isClosed: { type: Boolean, default: false },
  },
  { _id: false },
);

// Services Offered (To help patients filter)
const ClinicServiceSchema = new Schema(
  {
    name: { type: String, required: true }, // e.g., "General Checkup"
    category: {
      type: String,
      enum: ["General", "Specialist", "Dental", "Emergency"],
    },
    price: { type: Number },
  },
  { _id: false },
);

const ClinicSchema = new Schema(
  {
    name: { type: String, unique: true },
    registrationNumber: { type: String, unique: true }, // For verification
    email: { type: String },
    phone: { type: String },
    identifier: {
      type: String,
      unique: true,
      trim: true,
    },

    // Branding & Visuals
    logo: { type: String }, // URL to image
    description: { type: String },

    // Location Data
    address: {
      street: String,
      city: String,
      province: String,
      zipCode: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },

    // Operational Data
    hours: [OperatingHoursSchema],
    services: [ClinicServiceSchema],

    // Relationships (The Links)
    staff: {
      doctors: [{ type: Schema.Types.ObjectId, ref: "Doctor" }],
      nurses: [{ type: Schema.Types.ObjectId, ref: "Nurse" }],
      adminId: { type: Schema.Types.ObjectId, ref: "User" }, // The owner/manager
    },

    isVerified: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true },
);

ClinicSchema.pre("save", async function () {
  const clinic = this;

  // 2. Identifier Generation
  if (clinic.isNew && !clinic.identifier) {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    clinic.identifier = `CLI-${randomDigits}`;
  }
});

export const Clinic = mongoose.model("Clinic", ClinicSchema);
export type ClinicType = mongoose.InferSchemaType<typeof ClinicSchema>;

export const OperatingHours = mongoose.model(
  "OperatingHours",
  OperatingHoursSchema,
);
export const ClinicService = mongoose.model(
  "ClinicService",
  ClinicServiceSchema,
);
