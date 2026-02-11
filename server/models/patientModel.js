import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30,
    },
    idNumber: {
      type: String,
      required: true,
      unique: true,
      minLength: 3,
      maxLength: 13,
    },
    phone: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    address: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 150,
    },
  },
  {
    timestamps: true,
  }
);

const patientModel = mongoose.model("Patient", patientSchema);
export { patientModel };
