import { Status } from "../utils/status";
import prisma from "../config/prisma";
import supabase from "../config/supabase";
import { Request, Response } from "express";
import logger from "../utils/logger";
import {
  consultationMetaDataSchema,
  consultationSchema,
  prescriptionSchema,
} from "../schemas/consultation.schema";
import { getFormattedSpeechData } from "../utils/helper";

export const getConsultationList = async (
  req: any,
  res: any,
): Promise<void> => {
  try {
    const data = await prisma.consultation.findMany();
    return res.status(200).json({
      status: Status.SUCCESS,
      data,
    });
  } catch (err) {
    return res.status(500).json({
      status: Status.ERROR,
      message: (err as Error).message,
    });
  }
};

export const getConsultationWithID = async (
  req: { params: { id: any } },
  res: any,
): Promise<void> => {
  const id = req.params.id;
  try {
    const data = await prisma.consultation.findUnique({ where: { id } });
    return res.status(200).json({
      status: Status.SUCCESS,
      data,
    });
  } catch (err) {
    return res.status(500).json({
      status: Status.ERROR,
      message: (err as Error).message,
    });
  }
};

export const getPatientConsultation = async (
  req: { params: { id: any } },
  res: any,
): Promise<void> => {
  const id = req.params.id;

  try {
    const data = await prisma.consultation.findMany({
      where: { patientId: id },
    });
    return res.status(200).json({
      status: Status.SUCCESS,
      data,
    });
  } catch (err) {
    return res.status(500).json({
      status: Status.ERROR,
      message: (err as Error).message,
    });
  }
};

export const getDoctorConsultation = async (
  req: { params: { id: any } },
  res: any,
): Promise<void> => {
  const id = req.params.id;

  try {
    const data = await prisma.consultation.findMany({
      where: { doctorId: id },
      include: {
        patient: {
          select: {
            name: true,
          },
        },
      },
    });
    return res.status(200).json({
      status: Status.SUCCESS,
      data,
    });
  } catch (err) {
    return res.status(500).json({
      status: Status.ERROR,
      message: (err as Error).message,
    });
  }
};

export const createConsultationMetaData = async (
  req: Request,
  res: Response,
) => {
  const doctorId = req.headers.id as string;
  const result = consultationMetaDataSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ status: Status.BAD_REQUEST, message: result.error });
  }
  const { patientId, appointmentId } = req.body.payload;

  const patient = await prisma.patient.findUnique({
    where: { id: patientId as string },
  });
  if (!patient) {
    return res
      .status(400)
      .json({ status: Status.BAD_REQUEST, message: "Invalid patient id" });
  }
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId as string },
  });
  if (!appointment) {
    return res
      .status(400)
      .json({ status: Status.BAD_REQUEST, message: "Invalid appointment id" });
  }
  try {
    const result = await prisma.consultation.upsert({
      where: {
        doctorId_appointmentId: {
          doctorId,
          appointmentId,
        },
      },
      update: {
        patientId,
        doctorId,
        appointmentId,
      },
      create: {
        patientId,
        doctorId,
        appointmentId,
      },
    });
    return res.status(200).json({
      status: Status.SUCCESS,
      message: "Consultation info updated",
      data: result,
    });
  } catch (err) {
    logger.error({ message: (err as Error).message });
    return res.status(500).json({
      status: Status.INTERNAL_SERVER_ERROR,
      message: "Failed to update consultation details",
    });
  }
};

export const handlePrescriptionFileUpload = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const result = prescriptionSchema.safeParse(req);

  if (!result.success) {
    return res
      .status(400)
      .json({ status: Status.BAD_REQUEST, message: result.error });
  }
  const consultation = await prisma.consultation.findUnique({
    where: { id: req.query.consultationId as string },
  });
  if (!consultation) {
    return res
      .status(400)
      .json({ status: Status.BAD_REQUEST, message: "Invalid consultation id" });
  }

  const bucket = process.env.SUPABASE_PRESCRIPTIONS_BUCKET ?? "misc";
  try {
    const filename = `${consultation.patientId}/prescription`;
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filename, (req.file as Express.Multer.File).buffer, {
        contentType: "application/pdf",
        upsert: true,
      });
    logger.error({ message: error, interactionId: req.headers.interactionId });
    const { data } = supabase.storage.from(bucket).getPublicUrl(filename);

    const result = await prisma.consultation.update({
      where: { id: consultation.id },
      data: {
        prescriptionUrl: data.publicUrl,
      },
    });
    return res.status(200).json({
      status: Status.SUCCESS,
      message: "Prescription file updated",
      data: result,
    });
  } catch (err) {
    logger.error({ message: (err as Error).message });
    return res.status(500).json({
      status: Status.INTERNAL_SERVER_ERROR,
      message: "Failed to upload prescription file",
    });
  }
};

export const updatePrescriptionContent = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const result = consultationSchema.safeParse(req.body);
  const { id, prescription } = req.body.payload;
  const { content } = prescription;
  if (!result.success) {
    return res
      .status(400)
      .json({ status: Status.BAD_REQUEST, message: result.error });
  }
  try {
    const consultation = await prisma.consultation.update({
      where: { id },
      data: {
        prescriptionContent: getFormattedSpeechData(content) as string,
      },
    });
    return res
      .status(200)
      .json({ message: "Prescription content updated", data: consultation });
  } catch (err) {
    logger.error({ message: (err as Error).message });
    return res.status(500).json({
      status: Status.INTERNAL_SERVER_ERROR,
      message: "Failed to upload prescription file",
    });
  }
};
