import { z } from "zod";

export const SlotSchema = z.object({
  doctorId: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  interval: z
    .number()
    .int()
    .positive()
    .refine((value) => [15, 30].includes(value), {
      message: "Interval must be either 15 or 30 minutes",
    }),
});
