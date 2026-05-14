import mongoose, { Schema } from "mongoose";

const BookingSchema = new Schema(
  {
    clinicId: { type: Schema.Types.ObjectId, ref: "Clinic", required: true },
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor" },
    nurseId: { type: Schema.Types.ObjectId, ref: "Nurse", required: true },

    // The specific service they are coming for
    service: {
      name: String,
      price: Number,
      duration: { type: Number, default: 30 }, // Duration in minutes
    },

    // Timing
    appointmentDate: { type: Date, required: true }, // The day
    startTime: { type: String, required: true }, // e.g., "10:30"
    endTime: { type: String, required: true }, // e.g., "11:00"

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed", "no-show"],
      default: "pending",
    },

    notes: { type: String }, // Patient symptoms or special requests
    paymentStatus: {
      type: String,
      enum: ["unpaid", "partial", "paid"],
      default: "unpaid",
    },
  },
  { timestamps: true },
);

// Indexing for fast lookups (Prevent double booking queries)
BookingSchema.index({ clinicId: 1, appointmentDate: 1, startTime: 1 });

export const Booking = mongoose.model("Booking", BookingSchema);

export type BookingDocument = mongoose.InferSchemaType<typeof BookingSchema>;

export type AppointmentInput = Partial<BookingDocument>;
