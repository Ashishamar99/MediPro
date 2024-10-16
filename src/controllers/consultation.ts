import { Status } from "../utils/status";
import prisma from "../config/prisma";
import supabase from "../config/supabase";

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

export const addConsultationInfo = async (
  req: { body: { prescription: string } },
  res: any,
): Promise<void> => {
  let payload = JSON.parse(req.body.prescription);
  try {
    const appointment = await prisma.appointment.findUnique({
      where: {
        id: payload.appointmentId,
        patientId: payload.patientId,
      },
    });
    if (!appointment) {
      return res
        .status(404)
        .json({ status: Status.FAILED, message: "Appointment not found" });
    }
    const prescription = await handlePrescriptionFileUpload(req as any);
    payload.audio = getFormattedSpeechData(payload.audio);
    payload = { ...payload, ...(prescription as Object) };
    const data = await prisma.consultation.create({
      data: payload,
    });

    return res.status(201).json({ status: Status.SUCCESS, data });
  } catch (err) {
    return res
      .status(500)
      .json({ status: Status.ERROR, message: (err as Error).message });
  }
};

const getFormattedSpeechData = (speechData: {
  medicineData: any[];
  diagnosis: any;
  advice: { length: boolean };
}): String => {
  const medicine = speechData.medicineData.join("\n");

  let formattedSpeechData = `Diagnosing for, ${speechData.diagnosis}.`;
  formattedSpeechData += ` Medicines prescribed, ${medicine}. `;
  formattedSpeechData += (speechData.advice.length as boolean)
    ? `Advice, ${speechData.advice}`
    : "";
  return formattedSpeechData;
};

const handlePrescriptionFileUpload = async (req: any) => {
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
