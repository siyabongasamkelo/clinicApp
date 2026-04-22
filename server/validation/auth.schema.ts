import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-C]{24}$/i, "Invalid ID format");

export const userLightRegisterSchema = z.object({
  body: z.object({
    // The 'identifier' can be an Email or a Staff ID
    email: z
      .string()
      .min(3, "StuffId is too short")
      .max(35, "Stuffid is too long"),
    fullName: z
      .string()
      .min(3, "StuffId is too short")
      .max(35, "Stuffid is too long"),

    password: z.string().min(6, "Password must be at least 6 characters"),

    // Our "hint" for server efficiency
    role: z.enum(["PATIENT", "DOCTOR", "NURSE", "ADMIN"]),
  }),
});

// 1. The "Lite" Auth Essentials (Used for Registration)
export const AuthSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(3, "Full name is required"),
  role: z.enum(["DOCTOR", "NURSE", "PATIENT"]),
});

export const ResetPasswordLinkSchema = z.object({
  body: z.object({
    email: z.string(),
  }),
});

export const ResetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(6, "token must be at least 6 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),

    id: z
      .string()
      .length(24, "Invalid user ID length")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
  }),
});

export const VerifyAccountSchema = z.object({
  body: z.object({
    token: z.string().min(6, "token must be at least 6 characters"),
    email: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

export const LoginSchema = z.object({
  body: z.object({
    identifier: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
});

// 2. The Contact Piece
export const ContactSchema = z.object({
  phoneNumber: z.string().min(10, "Invalid phone number"),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
    })
    .optional(),
});

// 3. The Professional Piece
export const ProfessionalSchema = z.object({
  licenseNo: z.string().min(5, "License number is required"),
  specialization: z.array(z.string()).min(1, "Select at least one specialty"),
  consultationFee: z.number().positive("Fee must be a positive number"),
  clinicId: z.string().uuid("Invalid Clinic ID"), // or .min(1) for MongoIDs
});

// The complete Doctor Profile Schema
export const CompleteDoctorSchema = AuthSchema.extend({
  contact: ContactSchema,
  professional: ProfessionalSchema,
  bio: z.string().max(500).optional(),
});

export const updateDoctorSchema = z
  .object({
    fullName: z.string().min(2).optional(),
    profilePhoto: z.string().url().optional(),

    contact: z
      .object({
        phoneNumber: z.string().optional(),
        address: z
          .object({
            street: z.string().optional(),
            city: z.string().optional(),
            state: z.string().optional(),
            zipCode: z.string().optional(),
          })
          .optional(),
      })
      .optional(),

    practice: z
      .object({
        clinicId: objectIdSchema.optional(),
        consultationFee: z.number().nonnegative().optional(),
        timeSlotPerClient: z.number().min(5).optional(),
        isVerified: z.boolean().optional(),
        isActive: z.boolean().optional(),
      })
      .optional(),

    background: z
      .object({
        qualifications: z
          .array(
            z.object({
              institution: z.string(),
              major: z.string(),
              yearGraduated: z.number(),
            }),
          )
          .optional(),
        previousExperience: z
          .array(
            z.object({
              clinicName: z.string(),
              years: z.number(),
              role: z.string(),
            }),
          )
          .optional(),
        languagesSpoken: z.array(z.string()).optional(),
        bio: z.string().max(500).optional(),
      })
      .optional(),

    professional: z
      .object({
        specialization: z.array(z.string()).optional(),
        licenseNo: z.string().optional(),
        practicingFrom: z.coerce.date().optional(), // Coerce handles string-to-date conversion
        yearsOfExperience: z.number().min(0).optional(),
        averageRating: z.number().min(0).max(5).optional(),
      })
      .optional(),
  })
  .partial();

// This automatically creates a TypeScript type from the schema!
export type UserLightRegisterSchema = z.infer<typeof userLightRegisterSchema>;
export type DoctorRegistration = z.infer<typeof AuthSchema>;
export type DoctorFullProfile = z.infer<typeof CompleteDoctorSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ResetPasswordLinkInput = z.infer<typeof ResetPasswordLinkSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type VerifyAccountInput = z.infer<typeof VerifyAccountSchema>;
export type UpdateDoctorBody = z.infer<typeof updateDoctorSchema>;

//---------------------------------old schemas-------------------------//
