import { z } from "zod";

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

// This automatically creates a TypeScript type from the schema!
export type UserLightRegisterSchema = z.infer<typeof userLightRegisterSchema>;
export type DoctorRegistration = z.infer<typeof AuthSchema>;
export type DoctorFullProfile = z.infer<typeof CompleteDoctorSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ResetPasswordLinkInput = z.infer<typeof ResetPasswordLinkSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type VerifyAccountInput = z.infer<typeof VerifyAccountSchema>;

//---------------------------------old schemas-------------------------//
export type DoctorRegistrationInput = z.infer<typeof doctorRegistrationSchema>;
