import mongoose, { Schema, model, InferSchemaType, Document } from "mongoose";

const userSchema = new Schema(
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
  },
  {
    timestamps: true,
  },
);
type UserData = InferSchemaType<typeof userSchema>;

// 1. Extract the Type so other files can use it: import { User } from '...'
// export type User = InferSchemaType<typeof userSchema>;

export interface User extends UserData, Document {}

// 2. Create the Model using that Type
const userModel = model<User>("User", userSchema);

export { userModel };
