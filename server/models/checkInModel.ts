import { Schema, model, Document } from "mongoose";

interface ICheckIn extends Document {
  userId: Schema.Types.ObjectId;
  clinicId: Schema.Types.ObjectId;
  patientName: string; // Optional: redundancy for faster lookups
  checkInTime: Date;
  status: "pending" | "completed" | "cancelled"; // Helpful for tracking the visit
}

const checkInSchema = new Schema<ICheckIn>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  clinicId: {
    type: Schema.Types.ObjectId,
    ref: "Clinic",
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  checkInTime: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
});

// Indexing these makes queries much faster when you have thousands of check-ins
checkInSchema.index({ userId: 1, clinicId: 1 });

export const CheckIn = model<ICheckIn>("CheckIn", checkInSchema);
