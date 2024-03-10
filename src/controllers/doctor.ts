import { createClient } from "@supabase/supabase-js";
import db from "../database/knex";
import prisma from "../database/prisma";
import { Request, Response } from "express";
import { z } from "zod";
import { randomUUID } from "crypto";
import { Status } from "../enums/status";
import bcrypt from "bcrypt";

const supabaseUrl = process.env.SUPABASE_URL ?? "";
const supabaseKey = process.env.SUPABASE_KEY ?? "";
const supabase = createClient(supabaseUrl, supabaseKey);


const userSchema = z.object({
  user: z.object({
    name: z.string(),
    phone: z.string().min(10).max(10),
    role: z.string(),
    password: z.string()
  })
});

const doctorRegisterSchema = z.object({
  file: z.any().refine(
    (file) => typeof file !== typeof File,
    `File is required`
  ),
  body: userSchema
})

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
      status: "Failed", code: 500,
      message: "Internal Server Error",
      "errors": [
        {
          code: "INTERNAL_SERVER_ERROR",
          message: error
        }
      ]
    });
  }
};

export const getDoctorWithID = async (req: Request, res: Response): Promise<Response> => {
  const id = req.params.id;
  const doctor = await prisma.doctor.findUnique({ where: { id } });
  return res.json({ doctor });
};


export const handleDoctorLogin = (req, res): void => {
  const { phone, password } = req.body;
  let doctor = prisma.doctor.findUnique({ where: { phone } });


};

interface DoctorData {
  id: string;
  name: string;
  imageUrl: string;
  phone: string;
  signatureUrl: string;
  signatureFilename: string;
  role: string;
  password: string;
}

const uploadFileToSupabase = async (filename: string, buffer: File): Promise<any> => {
  const { error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET ?? "")
    .upload(filename, buffer, { contentType: "image/png" });
  const { data } = supabase.storage
    .from(process.env.SUPABASE_BUCKET ?? "")
    .getPublicUrl(filename);

  if (error) console.log(error);
  return data;
};

const handleFileUpload = async (req): Promise<DoctorData> => {
  console.log(req.body)
  let { user } = req.body;
  const filename = `${Date.now().toString()}-${req.file.originalname}`;
  const data = await uploadFileToSupabase(filename, req.file.buffer);

  user.signatureUrl = data.publicUrl;
  user.signatureFilename = filename;
  user.id = user.id || randomUUID();
  return user;
}

export const handleDoctorRegister = async (req: Request, res: Response): Promise<Response<void>> => {
  if (typeof req.body.user === 'string') {
    req.body.user = JSON.parse(req.body.user)
  }
  const result = doctorRegisterSchema.safeParse(req);

  if (!result.success) {
    return res.status(400).json({ status: Status.FAILED, code: 400, message: result.error })
  }

  try {
    let doctor = await prisma.doctor.findUnique({ where: { phone: req.body.user.phone } });
    if (doctor) {
      return res.status(400).json({ status: Status.FAILED, message: "User already exists" })
    }
    doctor = await handleFileUpload({ file: req.file, body: req.body });
    doctor.password = await bcrypt.hash(doctor.password, 10);
    let response = await prisma.doctor.create({ data: doctor });
    return res.status(201).json({ status: Status.SUCCESS, message: "Doctor registered successfully", data: { ...response, password: undefined } });
  } catch (err) {
    console.log(err)
    return res.status(500).json({ status: Status.ERROR, message: err });
  }

};

export const getDoctorWithRole = (req, res): void => {
  const role = req.body.role;
  db.select("*")
    .from("doctor")
    .where({ role, isAvailable: "1" })
    .then((doctor) => {
      res.status(200).send(doctor[0]); // return only one doctor
    })
    .catch((err) => {
      res.status(400).send("Unable to get user");
      console.error(err);
    });
};

export const getAvailableDoctors = (req, res): void => {
  db.select("*")
    .from("doctor")
    .where({ isAvailable: "1" })
    .then((doctor) => {
      res.status(200).send(doctor);
    })
    .catch((err) => {
      res.status(400).send("Unable to get user");
      console.error(err);
    });
};

export const deleteDoctorWithID = async (req, res): Promise<void> => {
  const id = req.params.id;
  const doctor = await prisma.doctor.findUnique({
    where: { id },
  });
  if (doctor === null) {
    return res.status(404).json({ status: "Not found", message: "No doctor found for given id" })
  }
  await supabase.storage
    .from("medipro-signatures")
    .remove([doctor.signatureFilename]);
  const data = await prisma.doctor.delete({ where: { id } });
  return res.json({ status: "Success", message: "Doctor deleted successfully", id: data.id });

};
