export type Gender = "Male" | "Female" | "Other";
export type SmokingStatus = "Smoker" | "Non-Smoker" | "Former Smoker";
export type AlcoholConsumption = "None" | "Occasional" | "Frequent";

export interface IPatientResponse {
  _id: string;
  patientId: string; // MRN (Medical Record Number)
  fullName: string;
  email: string;
  password?: string;
  contactNumber: string;
  dateOfBirth: Date;
  gender: Gender;

  // Health Profile
  allergies: string[];
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  chronicConditions: string[];
  currentMedication: string[];

  // Emergency Contact
  emergencyContact: {
    name: string;
    phone: string;
  };

  // Lifestyle & Demographics
  physicalAddress: {
    street: string;
    city: string;
    zipCode: string;
  };
  occupation: string;
  lifestyle: {
    smokingStatus: SmokingStatus;
    alcoholConsumption: AlcoholConsumption;
  };

  // Medical Aid / Insurance
  medicalAid: {
    provider: string;
    number: string;
  };

  // System & Relationships
  nearbyClinicId: string; // Reference to Clinics
  assignedDoctorId?: string; // Preferred/Regular Doctor
  isVerified: boolean;
  lastVisitDate?: Date;
  role: "PATIENT";
}

export interface IPatientsResponse {
  _id: string;
  patientId: string;
  fullName: string;
  email: string;
  contactNumber: string;
  role: "PATIENT";
  healthSummary: {
    bloodGroup: string;
    allergies: string[];
    chronicConditions: string[];
    isVerified: boolean;
  };
  details: {
    dob: Date | string;
    gender: string;
    occupation?: string;
  };
  emergency: {
    name: string;
    phone: string;
  };
  nearbyClinicId?: string;
  lastVisit: string | Date;
}

// types/patient.type.ts

export interface IPatiensstResponse {
  _id: string;
  patientId: string;
  fullName: string;
  email: string;
  contactNumber: string;
  role: "PATIENT";

  // THIS IS THE MISSING PART:
  healthSummary: {
    bloodGroup: string;
    allergies: string[];
    chronicConditions: string[];
    isVerified: boolean;
  };

  details: {
    dob: Date | string;
    gender: string;
    occupation?: string;
  };

  emergency: {
    name: string;
    phone: string;
  };

  nearbyClinicId?: string;
  lastVisit: string | Date;
}
