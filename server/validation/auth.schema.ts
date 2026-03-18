import { z } from "zod";

export const staffLoginSchema = z.object({
  body: z.object({
    // The 'identifier' can be an Email or a Staff ID
    staffId: z
      .string()
      .min(3, "StuffId is too short")
      .max(10, "Stuffid is too long"),

    password: z.string().min(6, "Password must be at least 6 characters"),

    // Our "hint" for server efficiency
    role: z.enum(["PATIENT", "DOCTOR", "NURSE", "ADMIN"]),
  }),
});

export const patientLoginSchema = z.object({
  body: z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),

    role: z.enum(["PATIENT", "DOCTOR", "NURSE", "ADMIN"]),
    email: z
      .string()
      .email("Invalid email address")
      .toLowerCase()
      .min(5, "Email is too short")
      .max(80, "Email is too long"),
  }),
});

export const emailVerificationSchema = z.object({
  body: z.object({
    token: z.string().min(6, "token must be at least 6 characters"),
    role: z.enum(["PATIENT", "DOCTOR", "NURSE", "ADMIN"]),
    email: z
      .string()
      .email("Invalid email address")
      .toLowerCase()
      .min(5, "Email is too short")
      .max(80, "Email is too long"),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    role: z.enum(["PATIENT", "DOCTOR", "NURSE", "ADMIN"]),
    email: z
      .string()
      .email("Invalid email address")
      .toLowerCase()
      .min(5, "Email is too short")
      .max(80, "Email is too long"),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    role: z.enum(["PATIENT", "DOCTOR", "NURSE", "ADMIN"]),
    token: z.string().min(6, "token must be at least 6 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),

    id: z
      .string()
      .length(24, "Invalid user ID length")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
    email: z
      .string()
      .email("Invalid email address")
      .toLowerCase()
      .min(5, "Email is too short")
      .max(80, "Email is too long"),
  }),
});

export const doctorRegistrationSchema = z.object({
  body: z.object({
    fullName: z.string().min(3, "Full name is required"),
    // staffId: z.string().min(1, "Staff ID is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    specialization: z.array(z.string()).optional(),
    licenseNo: z.string().min(1, "License number is required"),
    contactNumber: z.string().min(10, "Contact number is required"),
    clinicId: z
      .string()
      .length(24, "Invalid Clinic ID length")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
    consultationFee: z.coerce.number().positive(),
    timeSlotPerClient: z.coerce.number().positive(),
    yearsOfExperience: z.coerce.number().positive(),
    languagesSpoken: z
      .array(z.string())
      .nonempty("Must have at least one item")
      .min(1),
    isActive: z.coerce.boolean(),
    averageRating: z.coerce.number().max(10),
  }),
  files: z
    .object({
      profilePhoto: z
        .any()
        .refine(
          (file) => file !== Array.isArray(file),
          "Only one photo allowed",
        )
        .refine((file) => file?.size <= 5 * 1024 * 1024, "Max file size is 5MB")
        .refine(
          (file) =>
            ["image/jpeg", "image/png", "image/webp"].includes(file?.mimetype),
          "Only .jpg, .png, and .webp formats are supported",
        ),
    })
    .required({ profilePhoto: true }), // Makes the file mandatory
});

export const patientRegistrationSchema = z.object({
  body: z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    fullName: z.string().min(3, "Full name is required"),
    email: z
      .string()
      .email("Invalid email address")
      .toLowerCase()
      .min(5, "Email is too short")
      .max(80, "Email is too long"),
    contactNumber: z.string().min(10, "Contact number is required"),
    dateOfBirth: z
      .string()
      .min(3, "date of birth is too short")
      .max(10, "date of birth is too long"),
    gender: z.enum(["Male", "Female", "Other"]),
    allergies: z
      .string()
      .min(3, "allergies is too short")
      .max(80, "allergies is too long"),
    bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
    chronicConditions: z
      .string()
      .min(3, "chronic conditions is too short")
      .max(80, "chronic conditions is too long"),
    currentMedication: z
      .string()
      .min(3, "current Medication is too short")
      .max(80, "current Medication is too long"),
    emergencyContact: z.object({
      name: z.string().min(1, "Emergency contact name is required"),
      phone: z.string().min(10, "Emergency contact phone is required"),
    }),
    physicalAddress: z.object({
      street: z.string().min(1, "physical address street name is required"),
      city: z.string().min(1, "physical address city name is required"),
      zipCode: z.string().min(1, "physical address zip code is required"),
    }),
    medicalAid: z.object({
      provider: z.string().min(1, "medical aid provider is required"),
      number: z.string().min(1, "Emergency contact name is required"),
    }),
    occupation: z
      .string()
      .min(3, "StuffId is too short")
      .max(80, "Stuffid is too long"),

    lifestyle: z.object({
      smokingStatus: z.enum(["Smoker", "Non-Smoker", "Former Smoker"]),
      alcoholConsumption: z.enum(["None", "Occasional", "Frequent"]),
    }),
    nearbyClinicId: z
      .string()
      .length(24, "Invalid Clinic ID length")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
    assignedDoctorId: z
      .string()
      .length(24, "Invalid Doctor ID length")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
    isVerified: z.coerce.boolean(),
    lastVisitDate: z.coerce
      .date()
      .max(new Date(), "Date cannot be in the future")
      .optional(),
  }),
  files: z
    .object({
      profilePhoto: z
        .any()
        .refine(
          (file) => file !== Array.isArray(file),
          "Only one photo allowed",
        )
        .refine((file) => file?.size <= 5 * 1024 * 1024, "Max file size is 5MB")
        .refine(
          (file) =>
            ["image/jpeg", "image/png", "image/webp"].includes(file?.mimetype),
          "Only .jpg, .png, and .webp formats are supported",
        ),
    })
    .required({ profilePhoto: true }), // Makes the file mandatory
});

export const nurseRegistrationSchema = z.object({
  body: z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    fullName: z.string().min(3, "Full name is required"),
    email: z
      .string()
      .email("Invalid email address")
      .toLowerCase()
      .min(5, "Email is too short")
      .max(80, "Email is too long"),
    contact: z.string().min(10, "Contact number is required"),
    nursingRank: z.enum(["RN", "EN", "CNS", "NP"]),
    departmentAssignment: z
      .string()
      .min(6, "department assignment must be at least 6 characters"),
    licenseNumber: z
      .string()
      .min(6, "license number must be at least 6 characters")
      .max(15, "license number must not be more than 6 characters"),
    triageCertified: z.coerce.boolean(),
    shiftType: z.enum(["Day", "Night", "Rotational"]),
    supervisingDoctorId: z
      .string()
      .length(24, "Invalid Supervising Doctor ID length")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
    specializedSkills: z.string().min(1, "Specialized skills is required"),
    languages: z
      .array(z.string())
      .nonempty("Must have at least one item")
      .min(1),

    address: z.object({
      street: z.string().min(1, "physical address street name is required"),
      city: z.string().min(1, "physical address city name is required"),
      zipCode: z.string().min(1, "physical address zip code is required"),
    }),
    clinicId: z
      .string()
      .length(24, "Invalid Supervising Doctor ID length")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
    isOnDuty: z.coerce.boolean(),
    canPrescribe: z.coerce.boolean(),
  }),
  files: z
    .object({
      profilePhoto: z
        .any()
        .refine(
          (file) => file !== Array.isArray(file),
          "Only one photo allowed",
        )
        .refine((file) => file?.size <= 5 * 1024 * 1024, "Max file size is 5MB")
        .refine(
          (file) =>
            ["image/jpeg", "image/png", "image/webp"].includes(file?.mimetype),
          "Only .jpg, .png, and .webp formats are supported",
        ),
    })
    .required({ profilePhoto: true }), // Makes the file mandatory
});

// This automatically creates a TypeScript type from the schema!
export type PatientLoginInput = z.infer<typeof patientLoginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type staffLoginInput = z.infer<typeof staffLoginSchema>;
export type ResetPasswordinInput = z.infer<typeof resetPasswordSchema>;
export type DoctorRegistrationInput = z.infer<typeof doctorRegistrationSchema>;
export type NurseRegistrationInput = z.infer<typeof nurseRegistrationSchema>;
export type EmailVerificationInput = z.infer<typeof emailVerificationSchema>;
export type PatientRegistrationInput = z.infer<
  typeof patientRegistrationSchema
>;
