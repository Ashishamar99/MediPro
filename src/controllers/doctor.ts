import prisma from "../config/prisma";
import { type Request, type Response } from "express";
import { randomUUID } from "crypto";
import { Status } from "../common/status";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  doctorLoginSchema,
  doctorRegisterSchema,
  doctorSignatureFileUpdateSchema,
} from "../schemas/doctor.schema";
import supabase from "../config/supabase";
import logger from "../utils/logger";

export const getDoctorsList = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    return res.json({
      status: Status.SUCCESS,
      data: await prisma.doctor.findMany(),
    });
  } catch (error) {
    logger.error({ message: "Failed to fetch doctors list", error });
    return res.json({
      status: "Failed",
      code: 500,
      message: "Internal Server Error",
      errors: [
        {
          code: "INTERNAL_SERVER_ERROR",
          message: error,
        },
      ],
    });
  }
};

export const getDoctorWithID = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id;
  try {
    const doctor = await prisma.doctor.findUnique({ where: { id } });
    return res.json({ status: Status.SUCCESS, ...doctor, password: undefined });
  } catch (err) {
    return res.json({ status: Status.ERROR, message: err });
  }
};

/**
 * Function to handle doctor login
 * @param req - Request
 * @param res - Response
 * @returns  Response
 */
export const handleDoctorLogin = async (req, res): Promise<Response<void>> => {
  const result = doctorLoginSchema.safeParse(req.body);
  if (!result.success) {
    logger.warn(result.error);
    return res
      .status(400)
      .json({ status: Status.BAD_REQUEST, message: "Invalid request body" });
  }
  const { phone, password } = req.body.user;
  const doctor = await prisma.doctor.findUnique({ where: { phone } });
  if (!doctor) {
    return res
      .status(404)
      .json({ status: Status.FAILED, message: "User not found" });
  }
  const isPasswordValid = await bcrypt.compare(password, doctor.password);
  if (!isPasswordValid) {
    logger.warn({ message: "Invalid credentials" });
    return res
      .status(401)
      .json({ status: Status.FAILED, message: "Invalid credentials" });
  }

  try {
    const token = jwt.sign({ phone }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({
      status: Status.SUCCESS,
      message: "Login successful",
      data: { token, id: doctor.id, name: doctor.name },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: Status.ERROR, message: err });
  }
};

export const handleDoctorRegister = async (
  req: Request,
  res: Response
): Promise<Response<void>> => {
  const result = doctorRegisterSchema.safeParse(req);
  const { user } = req.body;
  if (!result.success) {
    logger.error({ error: result.error });
    return res
      .status(400)
      .json({ status: Status.FAILED, message: result.error });
  }

  try {
    let doctor = await prisma.doctor.findUnique({
      where: { phone: user.phone },
    });
    if (doctor) {
      logger.warn({
        message: "User already exists",
      });
      return res
        .status(400)
        .json({ status: Status.FAILED, message: "User already exists" });
    }
    user.password = await bcrypt.hash(user.password, 10);
    user.id = randomUUID();
    const response = await prisma.doctor.create({ data: user });
    logger.info({
      message: "Doctor registered successfully",
    });
    return res.status(201).json({
      status: Status.SUCCESS,
      message: "Doctor registered successfully",
      data: { ...response, password: undefined },
    });
  } catch (err) {
    logger.error({
      message: "Failed to register doctor",
      error: err.name,
      description: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      status: Status.INTERNAL_SERVER_ERROR,
      message: "Failed to register doctor",
    });
  }
};

export const handleSignatureFileUpload = async (
  req: Request,
  res: Response
): Promise<Response<void>> => {
  try {
    const schemaValidation = doctorSignatureFileUpdateSchema.safeParse(req);
    const { id } = req.params;

    if (!schemaValidation.success) {
      logger.error({ error: schemaValidation.error });
      return res
        .status(400)
        .json({ status: Status.FAILED, message: schemaValidation.error });
    }
    const doctor = await prisma.doctor.findUnique({ where: { id } });
    if (!doctor) {
      logger.warn({
        message: "User not found",
      });
      return res
        .status(400)
        .json({ status: Status.FAILED, message: "User not found" });
    }
    await uploadSignatureFile(req.file, doctor);
    doctor.updatedAt = new Date();
    const result = await prisma.doctor.update({
      where: { id: doctor.id },
      data: doctor,
    });
    logger.info({ message: "Doctor data update successful" });
    return res.status(200).json({
      status: Status.SUCCESS,
      message: "Doctor data update successful",
      data: { ...result, password: undefined },
    });
  } catch (err) {
    logger.error({
      message: "Failed to upload signature file",
      error: err.name,
      description: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      status: Status.INTERNAL_SERVER_ERROR,
      message: "Failed to upload signature file",
    });
  }
};

export const getDoctorWithRole = async (req, res): Promise<Response<void>> => {
  const role: string = req.body.role;
  if (!role) {
    return res
      .status(400)
      .json({ status: Status.FAILED, message: "Role is required" });
  }
  const doctor = await prisma.doctor.findFirst({ where: { role } });
  return res
    .status(200)
    .json({ status: Status.SUCCESS, data: { ...doctor, password: undefined } });
};

export const deleteDoctorWithID = async (req, res): Promise<void> => {
  const id = req.params.id;
  const doctor = await prisma.doctor.findUnique({
    where: { id },
  });
  if (doctor === null) {
    return res
      .status(404)
      .json({ status: "Not found", message: "No doctor found for given id" });
  }
  if (doctor.signatureUrl) {
    await supabase.storage
      .from("medipro-signatures")
      .remove([`${doctor.id}/signature.png`]);
  }
  //using raw query to delete as there is a bug in prisma delete on cascade
  const data = await prisma.$queryRaw`DELETE FROM "Doctor" WHERE id = ${id}`;
  return res.json({
    status: "Success",
    message: "Doctor deleted successfully",
    id,
  });
};

const uploadSignatureFile = async (file, user) => {
  const filename = `${user.id}/signature`;
  const bucket = process.env.SUPABASE_SIGNATURES_BUCKET as string;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filename, file.buffer, {
      contentType: "image/png",
      upsert: true,
    });
  if (error) {
    throw new Error(error.message);
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
  user.signatureUrl = data.publicUrl;
};
