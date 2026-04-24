import { z } from "zod";

// Helper for MongoDB ObjectIDs if you have one, otherwise z.string()
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-H]{24}$/i, "Invalid ID format");

export const updateNurseSchema = z
  .object({
    fullName: z.string().min(2).optional(),
    // nurseId and email are usually not updated via a general profile update for security

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

    professional: z
      .object({
        nursingRank: z.enum(["RN", "EN", "CNS", "NP"]).optional(),
        licenseNumber: z.string().optional(),
        departmentAssignment: z.string().optional(),
        triageCertified: z.boolean().optional(),
        canPrescribe: z.boolean().optional(),
        specializedSkills: z.array(z.string()).optional(),
        languages: z.array(z.string()).optional(),
      })
      .optional(),

    deployment: z
      .object({
        clinicId: objectIdSchema.optional(),
        supervisingDoctorId: objectIdSchema.optional(),
        shiftType: z.enum(["Day", "Night", "Rotational"]).optional(),
        isOnDuty: z.boolean().optional(),
      })
      .optional(),
  })
  .partial(); // Makes the top-level keys optional for PATCH requests

export const getNurseByIdSchema = z.object({
  body: z.object({
    id: z
      .string()
      .length(24, "Invalid user ID length")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
  }),
});

export const getNurseByClinicSchema = z.object({
  body: z.object({
    clinicId: z
      .string()
      .length(24, "Invalid user ID length")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
  }),
});

export type GetNurseByClinicBody = z.infer<typeof getNurseByClinicSchema>;
export type GetNurseByIdBody = z.infer<typeof getNurseByIdSchema>;

export type UpdateNurseInput = z.infer<typeof updateNurseSchema>;
