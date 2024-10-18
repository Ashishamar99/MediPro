import { generateSlots } from "../utils/helper";
import { Status } from "../utils/status";
import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { CustomSlot } from "../utils/types";
import logger from "../utils/logger";
import prisma from "../config/prisma";
import { SlotSchema } from "../schemas/slot.schema";

export const getSlots = async (
  _req: Request<{}, any, any, ParsedQs, Record<string, any>>,
  res: Response<any, Record<string, any>, number>,
): Promise<any> => {
  try {
    const slots = await prisma.slot.findMany();
    return res.status(200).json({ status: Status.SUCCESS, data: slots });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: Status.ERROR, message: err });
  }
};

// export const generateSlots = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   const { startTime, endTime, interval } = req.body;
//   const slots: CustomSlot[] = generateTimeSlots(
//     new Date(),
//     new Date(startTime),
//     new Date(endTime),
//     interval,
//     req.headers.id as string
//   );
//   try {
//     const result = await prisma.slot.updateMany({
//       where: {
//         startTime: { lte: new Date(endTime), gte: new Date(startTime) },
//       },
//       data: slots,
//     });
//     res.status(201).json({ status: Status.SUCCESS, data: result });
//   } catch (err) {
//     logger.error({
//       message: (err as Error).message,
//       interactionId: req.headers.interactionId,
//     });
//     return res.status(500).json({ status: Status.ERROR, message: err });
//   }
// };

// export const getAvailableSlots = async (
//   req: Request<{}, any, any, ParsedQs, Record<string, any>>,
//   res: Response<any, Record<string, any>, number>
// ): Promise<any> => {
//   try {
//     const slots = await prisma.slot.findMany({
//       where: {
//         doctorId: req.query.id as string,
//         status: "available",
//       },
//     });
//     return res.status(200).json({ status: Status.SUCCESS, data: slots });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ status: Status.ERROR, message: err });
//   }
// };

// export const bookSlot = async (
//   req: Request<{}, any, any, ParsedQs, Record<string, any>>,
//   res: Response<any, Record<string, any>, number>
// ): Promise<any> => {
//   let { doctorId, slotDate } = req.body;
//   try {
//     const existingSlot = await prisma.slot.findFirst({
//       where: {
//         doctorId,
//         date: slotDate,
//         status: "available",
//       },
//     });

//     if (!existingSlot) {
//       throw new Error("Slot not available or does not exist");
//     }

//     const updatedSlot = await prisma.slot.update({
//       where: { id: existingSlot.id },
//       data: { status: "booked" },
//     });

//     return res.status(200).json({ status: Status.SUCCESS, data: updatedSlot });
//   } catch (error) {
//     console.error("Error booking slot:", error);
//     return res
//       .status(500)
//       .json({ status: Status.ERROR, message: (error as Error).message });
//   }
// };

export const upsertAvailabilityAndSlots = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const result = SlotSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json(result);
  }
  const { doctorId, date, startTime, endTime, interval } = req.body;
  // TODO: validation for start time and end time

  await prisma.$transaction(async (tx) => {
    const availability = await tx.availability.upsert({
      where: {
        doctorId_date: {
          doctorId: doctorId,
          date: date,
        },
      },
      update: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
      create: {
        doctorId: doctorId,
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });
    // Remove existing slots for this availability
    await tx.slot.deleteMany({
      where: {
        availabilityId: availability.id,
        isBooked: false,
      },
    });

    // Generate new slots
    const slots = generateSlots(
      availability.id,
      doctorId,
      new Date(startTime),
      new Date(endTime),
      interval,
    );
    // Bulk create new slots
    await tx.slot.createMany({
      data: slots,
    });
    return res.status(201).json({ data: availability });
  });
};
