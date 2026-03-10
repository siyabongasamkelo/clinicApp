// import mongoose, { Schema, model, InferSchemaType, Document } from "mongoose";
import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minLength: 3,
      maxLength: 30,
    },
    role: {
      type: String,
      enum: ["admin", "nurse", "doctor", "patient"],
      default: "patient",
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 100,
    },
    isVerified: {
      type: String,
      required: true,
      enum: ["true", "false"],
      default: "false",
    },
    medicalHistorySummary: { type: String },
  },
  {
    timestamps: true,
  },
);

export type User = mongoose.InferSchemaType<typeof userSchema>;

export const userModel = mongoose.model("User", userSchema);
