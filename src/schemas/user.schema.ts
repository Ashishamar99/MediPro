import { z } from "zod";

export const userSchema = z.object({
  user: z.object({
    name: z.string(),
    phone: z.string().min(10).max(10),
    role: z.string(),
    password: z.string(),
  }),
});
