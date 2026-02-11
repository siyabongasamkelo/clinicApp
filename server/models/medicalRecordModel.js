import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },

    notes: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: true,
          maxLength: 1000,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    diagnosis: {
      type: String,
      maxLength: 1000,
    },

    prescribedMedication: {
      type: String,
    },
  },
  { timestamps: true }
);

const medicalRecordModel = mongoose.model("MedicalRecord", medicalRecordSchema);
export { medicalRecordModel };
