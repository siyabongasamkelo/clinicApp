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
      required: true,
      enum: ["doctor", "nurse", "admin"],
    },
    password: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 100,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);
export { userModel };
