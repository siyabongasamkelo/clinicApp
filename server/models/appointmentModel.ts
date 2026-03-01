import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient ID is required"],
    },
    appointmentDate: { type: Date, required: true }, // e.g., 2024-06-15
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming Doctors are also in the User table with a 'doctor' role
      required: [true, "Doctor ID is required"],
    },
    // The start of the 1.5h block (e.g., 2024-06-10T04:00:00Z)
    sessionId: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled", "no-show"],
      default: "pending",
    },
    reasonForVisit: {
      type: String,
      required: [true, "Please provide a reason for the visit"],
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Middleware to auto-calculate endTime before saving
appointmentSchema.pre("save", async function (next) {
  if (this.startTime) {
    // Adding 90 minutes (1.5 hours)
    this.endTime = new Date(this.startTime.getTime() + 90 * 60000);
  }
});

export const Appointment = mongoose.model("Appointment", appointmentSchema);
