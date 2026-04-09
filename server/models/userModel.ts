// models/User.ts
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
const UserSchema = new Schema(
  {
    // The unique identifier for login (e.g., Staff ID or Email)
    identifier: {
      type: String,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    // This role tells the app which profile table to look in
    role: {
      type: String,
      required: true,
      enum: ["DOCTOR", "NURSE", "PATIENT", "ADMIN"],
    },
    // This connects this "Identity" to a specific "Profile"
    // It's a generic reference that works for any profile table
    profileId: {
      type: Schema.Types.ObjectId,
      refPath: "roleModel",
    },
    // Helper field to tell Mongoose which model 'profileId' refers to
    roleModel: {
      type: String,
      //   required: true,
      enum: ["Doctor", "Nurse", "Patient"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function () {
  const user = this;

  // 1. Password Hashing
  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }

  // 2. Identifier Generation
  if (user.isNew && !user.identifier) {
    if (user.role === "PATIENT") {
      user.identifier = user.email;
    } else {
      const prefix = user.role.substring(0, 3).toUpperCase();
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      user.identifier = `${prefix}-${randomDigits}`;
    }
  }
});

export const User = mongoose.model("User", UserSchema);
