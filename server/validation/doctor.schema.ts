import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-C]{24}$/i, "Invalid ID format");

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

export const getDoctorByIdSchema = z.object({
  body: z.object({
    id: z
      .string()
      .length(24, "Invalid user ID length")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
  }),
});

export const getDoctorByClinicSchema = z.object({
  body: z.object({
    clinicId: z
      .string()
      .length(24, "Invalid user ID length")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
  }),
});

export type GetDoctorByClinicBody = z.infer<typeof getDoctorByClinicSchema>;
export type GetDoctorByIdBody = z.infer<typeof getDoctorByIdSchema>;
export type UpdateDoctorBody = z.infer<typeof updateDoctorSchema>;
