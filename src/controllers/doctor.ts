import prisma from "../config/prisma";
import { type Request, type Response } from "express";
import { randomUUID } from "crypto";
import { Status } from "../common/status";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { type DoctorData } from "../common/types";
import { doctorRegisterSchema } from "../schemas/doctor.schema";
import supabase from "../config/supabase";
import logger from "../logger";

export const getDoctorsList = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    return res.json({
      status: "Success",
      data: await prisma.doctor.findMany(),
    });
  } catch (error) {
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
  const { phone, password } = req.body;
  const doctor = await prisma.doctor.findUnique({ where: { phone } });
  if (!doctor) {
    return res
      .status(404)
      .json({ status: Status.FAILED, message: "User not found" });
  }
  const isPasswordValid = await bcrypt.compare(password, doctor.password);
  if (!isPasswordValid) {
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
  if (typeof req.body.user === "string") {
    req.body.user = JSON.parse(req.body.user);
  }
  const result = doctorRegisterSchema.safeParse(req);

  if (!result.success) {
    logger.error(result.error);
    return res
      .status(400)
      .json({ status: Status.FAILED, code: 400, message: result.error });
  }

  try {
    let doctor = await prisma.doctor.findUnique({
      where: { phone: req.body.user.phone },
    });
    if (doctor) {
      logger.warn({
        message: "User already exists",
        interactionId: req.headers.interactionId,
      });
      return res
        .status(400)
        .json({ status: Status.FAILED, message: "User already exists" });
    }
    const { user, error } = await handleSignatureFileUpload({
      file: req.file,
      body: req.body,
    });
    if (user === null) {
      logger.error({
        message: "Error uploading signature file",
        interactionId: req.headers.interactionId,
        ...error
      });
      return res
        .status(500)
        .json({
          status: Status.INTERNAL_SERVER_ERROR,
          message: "Error uploading signature file",
        });
    }
    user.password = await bcrypt.hash(user.password, 10);
    const response = await prisma.doctor.create({ data: user });
    return res.status(201).json({
      status: Status.SUCCESS,
      message: "Doctor registered successfully",
      data: { ...response, password: undefined },
    });
  } catch (err) {
    logger.error({
      message: "Failed to register doctor",
      interactionId: req.headers.interactionId,
    });
    return res
      .status(500)
      .json({ status: Status.ERROR, message: "Failed to register doctor" });
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
  await supabase.storage
    .from("medipro-signatures")
    .remove([doctor.signatureFilename]);
  //using raw query to delete as there is a bug in prisma delete on cascade
  const data = await prisma.$queryRaw`DELETE FROM "Doctor" WHERE id = ${id}`;
  return res.json({
    status: "Success",
    message: "Doctor deleted successfully",
    id,
  });
};

const handleSignatureFileUpload = async (req) => {
  const { user } = req.body;
  const filename = `${Date.now().toString()}-${req.file.originalname}`;
  const bucket = process.env.SUPABASE_SIGNATURES_BUCKET as string;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filename, req.file.buffer, { contentType: "image/png" });
  if (error) {
    return { user: null, error };
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(filename);

  user.signatureUrl = data.publicUrl;
  user.signatureFilename = filename;
  user.id = user.id || randomUUID();
  return { user, error: null };
};
