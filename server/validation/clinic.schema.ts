import { z } from "zod";

// --- Sub-Schemas (Value Objects) ---

export const OperatingHoursZodSchema = z.object({
  day: z.enum([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]),
  open: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)")
    .optional(),
  close: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)")
    .optional(),
  isClosed: z.boolean().default(false),
});

export const ClinicServiceZodSchema = z.object({
  name: z.string().min(2, "Service name is too short"),
  category: z.enum(["General", "Specialist", "Dental", "Emergency"]),
  price: z.number().nonnegative("Price cannot be negative").optional(),
});

// --- Main Clinic Schema ---

export const ClinicZodSchema = z
  .object({
    name: z.string().min(3, "Clinic name must be at least 3 characters"),
    registrationNumber: z
      .string()
      .min(5, "Registration number is required for verification"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),

    logo: z.string().url("Logo must be a valid URL").optional(),
    description: z.string().max(500, "Description is too long").optional(),

    address: z.object({
      street: z.string().min(1, "Street is required"),
      city: z.string().min(1, "City is required"),
      province: z.string().min(1, "Province is required"),
      zipCode: z.string().min(4, "Zip code is required"),
      coordinates: z
        .object({
          lat: z.number(),
          lng: z.number(),
        })
        .optional(),
    }),

    hours: z
      .array(OperatingHoursZodSchema)
      .length(7, "Must provide hours for all 7 days"),
    services: z
      .array(ClinicServiceZodSchema)
      .min(1, "At least one service must be offered"),

    staff: z.object({
      doctors: z.array(
        z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoID"),
      ), // Validates Hex string for ObjectId
      nurses: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoID")),
      adminId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoID"),
    }),

    isVerified: z.boolean().default(false),
    rating: z.number().min(0).max(5).default(0),
  })
  .partial();

export const getClinicByIdSchema = z.object({
  body: z.object({
    id: z
      .string()
      .length(24, "Invalid clinic ID length")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
  }),
});

export const getClinicByNameSchema = z.object({
  body: z.object({
    clinicName: z.string().length(100, "Invalid name ID length"),
  }),
});

export const getClinicByTownSchema = z.object({
  body: z.object({
    town: z.string().length(100, "Invalid name ID length"),
  }),
});

export const getClinicQrSchema = z.object({
  body: z.object({
    clinicId: z
      .string()
      .length(24, "Invalid clinic ID length")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
  }),
});

export const verifyCheckInSchema = z.object({
  body: z.object({
    scannedId: z
      .string()
      .length(24, "Invalid clinic ID length")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
    userId: z
      .string()
      .length(24, "Invalid clinic ID length")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
  }),
});

export type GetClinicByIdBody = z.infer<typeof getClinicByIdSchema>;
export type GetClinicQrBody = z.infer<typeof getClinicQrSchema>;
export type GetClinicByNameBody = z.infer<typeof getClinicByNameSchema>;
export type GetClinicByTownBody = z.infer<typeof getClinicByTownSchema>;

// --- TypeScript Type Inference ---
export type ClinicZodType = z.infer<typeof ClinicZodSchema>;

export type OperatingHoursZodType = z.infer<typeof OperatingHoursZodSchema>;
export type ClinicServiceZodType = z.infer<typeof ClinicServiceZodSchema>;
