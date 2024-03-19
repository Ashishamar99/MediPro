"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addConsultationInfo = exports.getDoctorConsultation = exports.getPatientConsultation = exports.getConsultationWithID = exports.getConsultationList = void 0;
const status_1 = require("../common/status");
const prisma_1 = __importDefault(require("../config/prisma"));
const supabase_1 = __importDefault(require("../config/supabase"));
const getConsultationList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield prisma_1.default.consultation.findMany();
        return res.status(200).json({
            status: status_1.Status.SUCCESS,
            data,
        });
    }
    catch (err) {
        return res.status(500).json({
            status: status_1.Status.ERROR,
            message: err.message,
        });
    }
});
exports.getConsultationList = getConsultationList;
const getConsultationWithID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const data = yield prisma_1.default.consultation.findUnique({ where: { id } });
        return res.status(200).json({
            status: status_1.Status.SUCCESS,
            data,
        });
    }
    catch (err) {
        return res.status(500).json({
            status: status_1.Status.ERROR,
            message: err.message,
        });
    }
});
exports.getConsultationWithID = getConsultationWithID;
const getPatientConsultation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const data = yield prisma_1.default.consultation.findMany({
            where: { patientId: id },
        });
        return res.status(200).json({
            status: status_1.Status.SUCCESS,
            data,
        });
    }
    catch (err) {
        return res.status(500).json({
            status: status_1.Status.ERROR,
            message: err.message,
        });
    }
});
exports.getPatientConsultation = getPatientConsultation;
const getDoctorConsultation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const data = yield prisma_1.default.consultation.findMany({
            where: { doctorId: id },
        });
        return res.status(200).json({
            status: status_1.Status.SUCCESS,
            data,
        });
    }
    catch (err) {
        return res.status(500).json({
            status: status_1.Status.ERROR,
            message: err.message,
        });
    }
});
exports.getDoctorConsultation = getDoctorConsultation;
const addConsultationInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    try {
        const appointment = yield prisma_1.default.appointment.findUnique({
            where: {
                id: req.body.appointmentId,
                patientId: payload.patientId,
                doctorId: payload.doctorId,
            },
        });
        if (!appointment) {
            return res
                .status(404)
                .json({ status: status_1.Status.FAILED, message: "Appointment not found" });
        }
        const prescription = handlePrescriptionFileUpload(req);
        req.body.audio = getFormattedSpeechData(payload.audio);
        req.body = Object.assign(Object.assign({}, req.body), prescription);
        const data = yield prisma_1.default.consultation.create({
            data: payload,
        });
        return res.status(201).json({ status: status_1.Status.SUCCESS, data });
    }
    catch (err) {
        return res.status(500).json({ status: status_1.Status.ERROR, message: err.message });
    }
});
exports.addConsultationInfo = addConsultationInfo;
const getFormattedSpeechData = (speechData) => {
    const medicine = speechData.medicineData.join("\n");
    let formattedSpeechData = `Diagnosing for, ${speechData.diagnosis}.`;
    formattedSpeechData += ` Medicines prescribed, ${medicine}\n`;
    formattedSpeechData += speechData.advice.length
        ? `Advice, ${speechData.advice}`
        : "";
    return formattedSpeechData;
};
const handlePrescriptionFileUpload = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const filename = `${Date.now().toString()}-${req.file.originalname}`;
    const bucket = (_a = process.env.SUPABASE_PRESCRIPTIONS_BUCKET) !== null && _a !== void 0 ? _a : "misc";
    try {
        const { error } = yield supabase_1.default.storage
            .from(bucket)
            .upload(filename, req.file.buffer, { contentType: "application/pdf" });
        if (error)
            throw error;
        const { data } = supabase_1.default.storage.from(bucket).getPublicUrl(filename);
        return { prescriptionUrl: data.publicUrl, prescriptionFilename: filename };
    }
    catch (err) {
        return err;
    }
});
//# sourceMappingURL=consultation.js.map