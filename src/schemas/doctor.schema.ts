import { z } from "zod";
import { userSchema } from "./user.schema";

export const doctorRegisterSchema = z.object({
  file: z
    .any()
    .refine((file) => file !== undefined, `File is required`)
    .optional(),
  body: userSchema,
});

export const doctorLoginSchema = z.object({
  user: z.object({
    phone: z.string(),
    password: z.string(),
  }),
});

export const doctorSignatureFileUpdateSchema = z.object({
  file: z.any().refine((file) => file !== undefined, `File is required`),
  params: z.object({
    id: z.string(),
  }),
});
