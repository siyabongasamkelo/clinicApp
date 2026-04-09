// types/user.types.ts
export interface IAuthUser {
  id: string;
  identifier: string; // can be staffId, email, etc.
  passwordHash: string;
  role: "DOCTOR" | "NURSE" | "PATIENT" | "ADMIN";
  fullName: string;
}
