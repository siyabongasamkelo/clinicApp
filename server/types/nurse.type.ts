export type NursingRank = "RN" | "EN" | "CNS" | "NP"; // Registered, Enrolled, Specialist, Practitioner
export type ShiftType = "Day" | "Night" | "Rotational";

export interface INurse {
  _id: string;
  fullName: string;
  staffId: string; // Login identifier (e.g. NRS-001)
  nurseId: string; // Professional/Clinical ID
  email: string;
  password?: string;
  contact: string;
  nursingRank: NursingRank;
  departmentAssignment: string; // e.g., "Triage", "Pediatrics"
  licenseNumber: string;
  triageCertified: boolean;
  shiftType: ShiftType;
  supervisingDoctorId?: string; // Reference to a Doctor ID
  specializedSkills: string[];
  languagesSpoken: string[];
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  clinicId: string; // Reference to the Clinic branch
  isOnDuty: boolean;
  canPrescribe: boolean;
  role: "NURSE";
}
