import { z } from "zod";

export const loginSchema = z.object({
  // The 'identifier' can be an Email or a Staff ID
  stuffId: z
    .string()
    .min(3, "StuffId is too short")
    .max(10, "Stuffid is too long"),

  password: z.string().min(6, "Password must be at least 6 characters"),

  // Our "hint" for server efficiency
  role: z.enum(["PATIENT", "DOCTOR", "NURSE", "ADMIN"]),

  // Optional clinic hint for even faster indexing
  email: z
    .string()
    .email("Invalid email address")
    .toLowerCase()
    .min(5, "Email is too short")
    .max(80, "Email is too long"),
});

export const doctorRegistrationSchema = z.object({
  body: z.object({
    fullName: z.string().min(3, "Full name is required"),
    staffId: z.string().min(1, "Staff ID is required"),
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
export type LoginInput = z.infer<typeof loginSchema>;
export type DoctorRegistrationInput = z.infer<typeof doctorRegistrationSchema>;
