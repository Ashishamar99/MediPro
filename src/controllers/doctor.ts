import { createClient } from "@supabase/supabase-js";
import prisma from "../database/prisma";
import { type Request, type Response } from "express";
import { randomUUID } from "crypto";
import { Status } from "../common/status";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { type DoctorData } from "../common/types";
import { doctorRegisterSchema } from "../schemas/doctor.schema";
import { uploadFileToSupabase } from "../common/helper";

const supabaseUrl = process.env.SUPABASE_URL ?? "";
const supabaseKey = process.env.SUPABASE_KEY ?? "";
const supabase = createClient(supabaseUrl, supabaseKey);

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
      data: { token, id: doctor.id },
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ status: Status.ERROR, message: err });
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
    return res
      .status(400)
      .json({ status: Status.FAILED, code: 400, message: result.error });
  }

  try {
    let doctor = await prisma.doctor.findUnique({
      where: { phone: req.body.user.phone },
    });
    if (doctor) {
      return res
        .status(400)
        .json({ status: Status.FAILED, message: "User already exists" });
    }
    doctor = await handleFileUpload({ file: req.file, body: req.body });
    doctor.password = await bcrypt.hash(doctor.password, 10);
    const response = await prisma.doctor.create({ data: doctor });
    return res.status(201).json({
      status: Status.SUCCESS,
      message: "Doctor registered successfully",
      data: { ...response, password: undefined },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: Status.ERROR, message: err });
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
  const data = await prisma.doctor.delete({ where: { id } });
  return res.json({
    status: "Success",
    message: "Doctor deleted successfully",
    id: data.id,
  });
};

const handleFileUpload = async (req): Promise<DoctorData> => {
  const { user } = req.body;
  const filename = `${Date.now().toString()}-${req.file.originalname}`;
  const data = await uploadFileToSupabase(filename, req.file.buffer);

  user.signatureUrl = data.publicUrl;
  user.signatureFilename = filename;
  user.id = user.id || randomUUID();
  return user;
};
