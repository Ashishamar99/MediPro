import prisma from "../config/prisma";
import { Status } from "../utils/status";
import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";

export const getAppointmentList = async (
  _req: Request<{}, any, any, ParsedQs, Record<string, any>>,
  res: Response<any, Record<string, any>, number>,
): Promise<any> => {
  try {
    return res.json({
      status: Status.SUCCESS,
      data: await prisma.appointment.findMany({
        include: {},
      }),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: Status.ERROR, message: err });
  }
};

export const createAppointment = async (
  req: Request<{}, any, any, ParsedQs, Record<string, any>>,
  res: Response<any, Record<string, any>, number>,
): Promise<any> => {
  const { patientId, doctorId, slotId } = req.body;

  try {
    const doctorExists = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctorExists) {
      return res
        .status(400)
        .json({ status: Status.BAD_REQUEST, message: "Invalid doctor ID." });
    }

    const patientExists = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patientExists) {
      return res
        .status(400)
        .json({ status: Status.BAD_REQUEST, message: "Invalid patient ID." });
    }
    const slot = await prisma.slot.findUnique({
      where: {
        id: slotId,
        AND: {
          doctorId,
        },
      },
    });

    if (!slot || slot.isBooked) {
      return res.status(404).json({
        status: Status.FAILED,
        message: "Slot not found or is already booked",
      });
    }

    const data = await prisma.$transaction(async (trx) => {
      const result = await trx.slot.update({
        where: {
          id: slot.id,
        },
        data: {
          isBooked: true,
        },
      });

      if (!result || !result.isBooked) {
        throw new Error("Slot not available or does not exist");
      }

      const appointment = await trx.appointment.create({
        data: {
          patientId,
          doctorId,
          slotId: slot.id,
          status: "created",
        },
      });

      return { ...appointment, slot: result };
    });

    return res.status(201).json({
      status: Status.SUCCESS,
      message: "Appointment created successfully",
      data,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ status: Status.ERROR, message: (err as Error).message });
  }
};

// export const cancelAppointment = async (
//   req: Request<{}, any, any, ParsedQs, Record<string, any>>,
//   res: Response<any, Record<string, any>, number>,
// ): Promise<any> => {
//   const { id, doctorId } = req.body;

//   try {
//     const existingAppointment = await prisma.appointment.findFirst({
//       where: {
//         id,
//       },
//       select: {
//         slot: {
//           select: {
//             id: true,
//           },
//         },
//       },
//     });

//     if (!existingAppointment) {
//       return res
//         .status(404)
//         .json({ status: Status.FAILED, message: "Appointment not found" });
//     }

//     const result = await prisma.$transaction(async (trx) => {
//       const appointment = await trx.appointment.delete({
//         where: {
//           id,
//         },
//       });

//       if (!appointment) throw new Error("Appointment not found");

//       const result = await trx.slot.update({
//         where: {
//           id: existingAppointment.slot.id,
//           doctorId,
//         },
//         data: {
//           status: "available",
//         },
//       });
//       return { slot: { id: result.id }, appointment: { id: appointment.id } };
//     });

//     if (!result) {
//       return res
//         .status(404)
//         .json({ status: Status.FAILED, message: "Slot not found" });
//     }

//     return res.status(200).json({
//       status: Status.SUCCESS,
//       message: "Appointment cancelled successfully",
//       data: result,
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ status: Status.ERROR, message: err });
//   }
// };

// export const getAppointmentWithID = async (
//   req: Request<{ id: string }, any, any, ParsedQs, Record<string, any>>,
//   res: Response<any, Record<string, any>, number>,
// ): Promise<any> => {
//   const id = req.params.id;
//   try {
//     const appointments = await prisma.appointment.findUnique({
//       where: {
//         id,
//       },
//       include: {
//         slot: true,
//       },
//     });
//     return res.status(200).json({ status: Status.SUCCESS, data: appointments });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ status: Status.ERROR, message: err });
//   }
// };

// export const getAppointmentWithPID = async (
//   req: Request<{ id: string }, any, any, ParsedQs, Record<string, any>>,
//   res: Response<any, Record<string, any>, number>,
// ): Promise<any> => {
//   const id = req.params.id;
//   try {
//     const appointments = await prisma.appointment.findMany({
//       where: {
//         patientId: id,
//       },
//       include: {
//         slot: true,
//       },
//     });
//     return res.status(200).json({ status: Status.SUCCESS, data: appointments });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ status: Status.ERROR, message: err });
//   }
// };

// export const getAppointmentWithDID = async (
//   req: Request<{ id: string }, any, any, ParsedQs, Record<string, any>>,
//   res: Response<any, Record<string, any>, number>,
// ): Promise<any> => {
//   const id = req.params.id;
//   try {
//     const appointments = await prisma.appointment.findMany({
//       where: {
//         doctorId: id,
//       },
//       include: {
//         patient: true,
//       },
//     });
//     return res.status(200).json({ status: Status.SUCCESS, data: appointments });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ status: Status.ERROR, message: err });
//   }
// };
