import prisma from "../config/prisma";
import { Status } from "../common/status";
import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";

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

export const getAvailableSlots = async (
  req: Request<{}, any, any, ParsedQs, Record<string, any>>,
  res: Response<any, Record<string, any>, number>,
): Promise<any> => {
  try {
    const slots = await prisma.slot.findMany({
      where: {
        doctorId: req.query.id as string,
        status: "available",
      },
    });
    return res.status(200).json({ status: Status.SUCCESS, data: slots });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: Status.ERROR, message: err });
  }
};

export const bookSlot = async (
  req: Request<{}, any, any, ParsedQs, Record<string, any>>,
  res: Response<any, Record<string, any>, number>,
): Promise<any> => {
  let { doctorId, slotDate, slotNumber } = req.body;
  try {
    const existingSlot = await prisma.slot.findFirst({
      where: {
        doctorId,
        date: slotDate,
        slotNumber,
        status: "available",
      },
    });

    if (!existingSlot) {
      throw new Error("Slot not available or does not exist");
    }

    const updatedSlot = await prisma.slot.update({
      where: { id: existingSlot.id },
      data: { status: "booked" },
    });

    return res.status(200).json({ status: Status.SUCCESS, data: updatedSlot });
  } catch (error) {
    console.error("Error booking slot:", error);
    return res
      .status(500)
      .json({ status: Status.ERROR, message: (error as Error).message });
  }
};
