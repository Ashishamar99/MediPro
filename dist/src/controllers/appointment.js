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
exports.getAppointmentWithDID = exports.getAppointmentWithPID = exports.getAppointmentWithID = exports.cancelAppointment = exports.createAppointment = exports.getAppointmentList = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const status_1 = require("../common/status");
const getAppointmentList = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.json({
            status: status_1.Status.SUCCESS,
            data: yield prisma_1.default.appointment.findMany({
                include: {
                    slot: true,
                },
            }),
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ status: status_1.Status.ERROR, message: err });
    }
});
exports.getAppointmentList = getAppointmentList;
const createAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientId, doctorId, slotNumber } = req.body;
    try {
        const slot = yield prisma_1.default.slot.findFirst({
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
                .json({ status: status_1.Status.FAILED, message: "Slot not found" });
        }
        const patient = yield prisma_1.default.patient.findFirst({
            where: {
                id: patientId,
            },
        });
        if (!slot) {
            return res
                .status(404)
                .json({ status: status_1.Status.FAILED, message: "Slot not found" });
        }
        if (!patient) {
            return res
                .status(404)
                .json({ status: status_1.Status.FAILED, message: "Patient not found" });
        }
        const data = yield prisma_1.default.$transaction((trx) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield trx.slot.update({
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
                console.log(result);
                throw new Error("Slot not available or does not exist");
            }
            const appointment = yield trx.appointment.create({
                data: {
                    patientId,
                    doctorId,
                    slotId: slot.id,
                },
            });
            return Object.assign(Object.assign({}, appointment), { slot: result });
        }));
        return res
            .status(201)
            .json({
            status: status_1.Status.SUCCESS,
            message: "Appointment created successfully",
            data,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ status: status_1.Status.ERROR, message: err.message });
    }
});
exports.createAppointment = createAppointment;
const cancelAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, slotNumber, doctorId } = req.body;
    try {
        const existingAppointment = yield prisma_1.default.appointment.findFirst({
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
                .json({ status: status_1.Status.FAILED, message: "Appointment not found" });
        }
        const result = yield prisma_1.default.$transaction((trx) => __awaiter(void 0, void 0, void 0, function* () {
            const appointment = yield trx.appointment.delete({
                where: {
                    id,
                },
            });
            if (!appointment)
                throw new Error("Appointment not found");
            const result = yield trx.slot.update({
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
        }));
        if (!result) {
            return res
                .status(404)
                .json({ status: status_1.Status.FAILED, message: "Slot not found" });
        }
        return res
            .status(200)
            .json({
            status: status_1.Status.SUCCESS,
            message: "Appointment cancelled successfully",
            data: result,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ status: status_1.Status.ERROR, message: err });
    }
});
exports.cancelAppointment = cancelAppointment;
const getAppointmentWithID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const appointments = yield prisma_1.default.appointment.findUnique({
            where: {
                id,
            },
            include: {
                slot: true,
            },
        });
        return res.status(200).json({ status: status_1.Status.SUCCESS, data: appointments });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ status: status_1.Status.ERROR, message: err });
    }
});
exports.getAppointmentWithID = getAppointmentWithID;
const getAppointmentWithPID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const appointments = yield prisma_1.default.appointment.findMany({
            where: {
                patientId: id,
            },
            include: {
                slot: true,
            },
        });
        return res.status(200).json({ status: status_1.Status.SUCCESS, data: appointments });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ status: status_1.Status.ERROR, message: err });
    }
});
exports.getAppointmentWithPID = getAppointmentWithPID;
const getAppointmentWithDID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const appointments = yield prisma_1.default.appointment.findMany({
            where: {
                doctorId: id,
            },
            include: {
                slot: true,
            },
        });
        return res.status(200).json({ status: status_1.Status.SUCCESS, data: appointments });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ status: status_1.Status.ERROR, message: err });
    }
});
exports.getAppointmentWithDID = getAppointmentWithDID;
//# sourceMappingURL=appointment.js.map