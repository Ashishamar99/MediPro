import prisma from "../config/prisma";
import { Status } from "../common/status";

export const getAppointmentList = async (_req, res): Promise<void> => {
  try {
    return res.json({
      status: Status.SUCCESS,
      data: await prisma.appointment.findMany({
        include: {
          slot: true,
        },
      }),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: Status.ERROR, message: err });
  }
};

export const createAppointment = async (req, res): Promise<void> => {
  const { patientId, doctorId, slotNumber } = req.body;
  try {
    const slot = await prisma.slot.findFirst({
      where: {
        slotNumber,
        doctorId,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!slot || slot.status === "booked") {
      return res
        .status(404)
        .json({ status: Status.FAILED, message: "Slot not found" });
    }

    const patient = await prisma.patient.findFirst({
      where: {
        id: patientId,
      },
    });

    if (!slot) {
      return res
        .status(404)
        .json({ status: Status.FAILED, message: "Slot not found" });
    }

    if (!patient) {
      return res
        .status(404)
        .json({ status: Status.FAILED, message: "Patient not found" });
    }

    const data = await prisma.$transaction(async (trx) => {
      const result = await trx.slot.update({
        where: {
          id: slot.id,
          slotNumber,
          doctorId,
        },
        data: {
          status: "booked",
        },
      });

      if (!result || result.status !== "booked") {
        throw new Error("Slot not available or does not exist");
      }

      const appointment = await trx.appointment.create({
        data: {
          patientId,
          doctorId,
          slotId: slot.id,
        },
      });

      return { ...appointment, slot: result };
    });

    return res
      .status(201)
      .json({
        status: Status.SUCCESS,
        message: "Appointment created successfully",
        data,
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: Status.ERROR, message: err.message });
  }
};

export const cancelAppointment = async (req, res): Promise<void> => {
  const { id, slotNumber, doctorId } = req.body;

  try {
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        id,
      },
      select: {
        slot: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!existingAppointment) {
      return res
        .status(404)
        .json({ status: Status.FAILED, message: "Appointment not found" });
    }

    const result = await prisma.$transaction(async (trx) => {
      const appointment = await trx.appointment.delete({
        where: {
          id,
        },
      });

      if (!appointment) throw new Error("Appointment not found");

      const result = await trx.slot.update({
        where: {
          id: existingAppointment.slot.id,
          slotNumber,
          doctorId,
        },
        data: {
          status: "available",
        },
      });
      return { slot: { id: result.id }, appointment: { id: appointment.id } };
    });

    if (!result) {
      return res
        .status(404)
        .json({ status: Status.FAILED, message: "Slot not found" });
    }

    return res
      .status(200)
      .json({
        status: Status.SUCCESS,
        message: "Appointment cancelled successfully",
        data: result,
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: Status.ERROR, message: err });
  }
};

export const getAppointmentWithID = async (req, res): Promise<void> => {
  const id = req.params.id;
  try {
    const appointments = await prisma.appointment.findUnique({
      where: {
        id,
      },
      include: {
        slot: true,
      },
    });
    return res.status(200).json({ status: Status.SUCCESS, data: appointments });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: Status.ERROR, message: err });
  }
};

export const getAppointmentWithPID = async (req, res): Promise<void> => {
  const id = req.params.id;
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: id,
      },
      include: {
        slot: true,
      },
    });
    return res.status(200).json({ status: Status.SUCCESS, data: appointments });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: Status.ERROR, message: err });
  }
};

export const getAppointmentWithDID = async (req, res): Promise<void> => {
  const id = req.params.id;
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: id,
      },
      include: {
        patient: true,
        slot: {
          select: {
            slotNumber: true
          }
        },
      },
    });
    return res.status(200).json({ status: Status.SUCCESS, data: appointments });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: Status.ERROR, message: err });
  }
};
