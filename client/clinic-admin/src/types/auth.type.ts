// src/types/auth.types.ts

export type UserRole = "admin" | "staff" | "super_admin";
export type UserVerification = "false" | "true";

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  profilePhoto: string;
  isVerified: UserVerification;
  token: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  username: string;
  email: string;
  profilePic: File;
}

export interface VerifyEmailRequestCredentials {
  email: string;
}

export interface VerifyEmailCredentials extends VerifyEmailRequestCredentials {
  token: string;
}

export interface ResetPasswordCredentials {
  email: string;
  password: string;
  id: string;
  token: string;
}

export interface AuthError {
  status: string;
  message: string;
}
