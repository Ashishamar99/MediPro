import { z } from "zod";
import { userSchema } from "./user.schema";

export const doctorRegisterSchema = z.object({
  file: z
    .any()
    .refine((file) => typeof file !== typeof File, `File is required`),
  body: userSchema,
});
