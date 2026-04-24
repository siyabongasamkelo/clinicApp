import { z } from "zod";

// For fields like userId that are MongoDB ObjectIds
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

const MedicalHistoryZodSchema = z.object({
  bloodGroup: z.string().min(1, "Blood group is required"),
  allergies: z.array(z.string()).default([]),
  chronicConditions: z.array(z.string()).default([]),
  currentMedication: z.array(z.string()).default([]),
});

const InsuranceZodSchema = z.object({
  provider: z.string().default("Private"),
  policyNumber: z.string().optional(),
});

const PersonalDetailsZodSchema = z.object({
  occupation: z.string().optional(),
  emergencyContact: z.object({
    name: z.string().min(1, "Emergency contact name is required"),
    phone: z.string().min(1, "Emergency contact phone is required"),
  }),
  lifestyle: z
    .object({
      smokingStatus: z
        .enum(["Smoker", "Non-Smoker", "Former Smoker"])
        .optional(),
      alcoholConsumption: z.enum(["None", "Occasional", "Frequent"]).optional(),
    })
    .optional(),
});

export const updatePatientSchema = z
  .object({
    userId: objectIdSchema,
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    contactNumber: z
      .string()
      .min(10, "Contact number must be at least 10 digits"),
    dateOfBirth: z.preprocess((arg) => {
      if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
    }, z.date()),
    gender: z.enum(["Male", "Female", "Other"]),

    // Nested Sub-documents
    medicalHistory: MedicalHistoryZodSchema,
    insurance: InsuranceZodSchema.optional(),
    personal: PersonalDetailsZodSchema,

    address: z
      .object({
        street: z.string().optional(),
        city: z.string().optional(),
        zipCode: z.string().optional(),
      })
      .optional(),

    clinicContext: z
      .object({
        nearbyClinicId: objectIdSchema.optional(),
        assignedDoctorId: objectIdSchema.optional(),
        lastVisitDate: z.string().datetime().optional().or(z.date().optional()),
      })
      .optional(),

    isVerified: z.boolean().default(false),
  })
  .partial();

export const getPatientByIdSchema = z.object({
  body: z.object({
    id: z
      .string()
      .length(24, "Invalid user ID length")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
  }),
});

export const getPatientByClinicSchema = z.object({
  body: z.object({
    clinicId: z
      .string()
      .length(24, "Invalid user ID length")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
  }),
});

export type GetPatientByClinicBody = z.infer<typeof getPatientByClinicSchema>;
export type GetPateientByIdBody = z.infer<typeof getPatientByIdSchema>;

// Infer types directly from the schema
export type PatientZodType = z.infer<typeof updatePatientSchema>;
