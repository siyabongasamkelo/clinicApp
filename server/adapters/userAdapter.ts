// adapters/UserAdapter.ts
import { IUser } from "../interfaces/IUsers";

export class DoctorAdapter implements IUser {
  id: string;
  identifier: string;
  role: "DOCTOR";
  fullName: string;
  email: string;

  constructor(doctor: any) {
    this.id = doctor.userId; // Links to Auth table
    this.identifier = doctor.staffId;
    this.role = "DOCTOR";
    this.fullName = doctor.fullName;
    this.email = doctor.email;
  }
}

export class UserAdapter {
  id: string;
  identifier: string;
  password: string;
  role: string;
  email: string;

  constructor(user: any) {
    this.id = user._id.toString(); // Links to Auth table
    this.identifier = user.identifier;
    this.password = user.password;
    this.role = user.role;
    this.email = user.email || "";
  }
}

export class NurseAdapter implements IUser {
  // Similar logic for Nurse
}
