import { z } from "zod";

export const consultationMetaDataSchema = z.object({
  payload: z.object({
    patientId: z.string(),
    appointmentId: z.string(),
  }),
});

export const prescriptionSchema = z.object({
  file: z
    .any()
    .refine((file) => file !== undefined, "Prescription file is required")
    .optional(),
  query: z.object({
    consultationId: z.string(),
  }),
});

export const consultationSchema = z.object({
  payload: z.object({
    id: z.string(),
    prescription: z.object({
      content: z.object({
        medicine: z.array(z.string()),
        diagnosis: z.string(),
        advice: z.string(),
      }),
    }),
  }),
});
