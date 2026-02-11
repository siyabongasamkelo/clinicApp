import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30,
    },
    doctorId: {
      type: String,
      required: true,
      unique: true,
      minLength: 3,
      maxLength: 13,
    },
    status: {
      type: String,
      required: true,
      unique: true,
      minLength: 3,
      maxLength: 50,
    },
  },
  {
    timestamps: true,
  }
);

const appointmentModel = mongoose.model("Appointment", appointmentSchema);
export { appointmentModel };
