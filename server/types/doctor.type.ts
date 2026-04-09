export interface IExperience {
  clinicName: string;
  years: number;
  role: string;
}

export interface IQualification {
  institution: string;
  major: string;
  yearGraduated: number;
}

export interface IDoctor {
  _id: string;
  fullName: string;
  staffId: string; // The login identifier (e.g. DOC-001)
  email: string;
  password?: string; // Stored here for the 3-table auth split
  specialization: string[];
  licenseNo: string;
  practicingFrom: Date;
  contactNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  clinicId: string; // Reference to the Clinics table
  yearsOfExperience: number;
  bio: string;
  profilePhoto?: string;
  previousExperience: IExperience[];
  qualifications: IQualification[];
  consultationFee: number;
  timeSlotPerClient: number; // in minutes
  languagesSpoken: string[];
  isActive: boolean;
  averageRating: number;
  role: "DOCTOR"; // Hardcoded for this table
}

// types/doctor.types.ts
export interface IDoctorUpdateInput {
  contact?: {
    phoneNumber?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
  };
  practice?: {
    clinicId?: string;
    consultationFee?: number;
    timeSlotPerClient?: number;
  };
  professional?: {
    specialization?: string[];
    licenseNo?: string;
  };
  bio?: string;
}
