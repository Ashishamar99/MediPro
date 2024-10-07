import { Status } from "../common/status";
import prisma from "../config/prisma";
import supabase from "../config/supabase";

export const getConsultationList = async (req, res): Promise<void> => {
  try {
    const data = await prisma.consultation.findMany();
    return res.status(200).json({
      status: Status.SUCCESS,
      data,
    });
  } catch (err) {
    return res.status(500).json({
      status: Status.ERROR,
      message: err.message,
    });
  }
};

export const getConsultationWithID = async (req, res): Promise<void> => {
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
      message: err.message,
    });
  }
};

export const getPatientConsultation = async (req, res): Promise<void> => {
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
      message: err.message,
    });
  }
};

export const getDoctorConsultation = async (req, res): Promise<void> => {
  const id = req.params.id;

  try {
    const data = await prisma.consultation.findMany({
      where: { doctorId: id },
      include: {
        patient: {
          select: {
            name: true,
          }
        }
      }
    });
    return res.status(200).json({
      status: Status.SUCCESS,
      data,
    });
  } catch (err) {
    return res.status(500).json({
      status: Status.ERROR,
      message: err.message,
    });
  }
};

export const addConsultationInfo = async (req, res): Promise<void> => {
  let payload = JSON.parse(req.body.prescription);
  try {
    const appointment = await prisma.appointment.findUnique({
      where: {
        id: payload.appointmentId,
        patientId: payload.patientId,
        doctorId: payload.doctorId,
      },
    });
    if (!appointment) {
      return res
        .status(404)
        .json({ status: Status.FAILED, message: "Appointment not found" });
    }
    const prescription = await handlePrescriptionFileUpload(req);
    payload.audio = getFormattedSpeechData(payload.audio);
    payload = { ...payload, ...prescription };
    const data = await prisma.consultation.create({
      data: payload,
    });

    return res.status(201).json({ status: Status.SUCCESS, data });
  } catch (err) {
    return res.status(500).json({ status: Status.ERROR, message: err.message });
  }
};

const getFormattedSpeechData = (speechData): String => {
  const medicine = speechData.medicineData.join("\n");

  let formattedSpeechData = `Diagnosing for, ${speechData.diagnosis}.`;
  formattedSpeechData += ` Medicines prescribed, ${medicine}. `;
  formattedSpeechData += (speechData.advice.length as boolean)
    ? `Advice, ${speechData.advice}`
    : "";
  return formattedSpeechData;
};

const handlePrescriptionFileUpload = async (req) => {
  const filename = `${Date.now().toString()}-${req.file.originalname}`;
  const bucket = process.env.SUPABASE_PRESCRIPTIONS_BUCKET ?? "misc";
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filename, req.file.buffer, { contentType: "application/pdf" });
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(filename);

    return { prescriptionUrl: data.publicUrl, prescriptionFilename: filename };
  } catch (err) {
    return err;
  }
};
