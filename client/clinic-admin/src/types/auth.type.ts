// src/types/auth.types.ts

export type UserRole = "admin" | "staff" | "super_admin";

export interface User {
  id: string;
  staffId: string;
  name: string;
  email: string;
  role: UserRole;
  clinicId?: string; // Optional: In case you scale to multiple clinics later
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  staffId: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  email: string;
  confirmPassword: string;
}
