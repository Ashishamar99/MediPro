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
exports.bookSlot = exports.getAvailableSlots = exports.getSlots = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const status_1 = require("../common/status");
const getSlots = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slots = yield prisma_1.default.slot.findMany();
        return res.status(200).json({ status: status_1.Status.SUCCESS, data: slots });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ status: status_1.Status.ERROR, message: err });
    }
});
exports.getSlots = getSlots;
const getAvailableSlots = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slots = yield prisma_1.default.slot.findMany({
            where: {
                doctorId: req.query.id,
                status: "available",
            },
        });
        return res.status(200).json({ status: status_1.Status.SUCCESS, data: slots });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ status: status_1.Status.ERROR, message: err });
    }
});
exports.getAvailableSlots = getAvailableSlots;
const bookSlot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { doctorId, slotDate, slotNumber } = req.body;
    try {
        const existingSlot = yield prisma_1.default.slot.findFirst({
            where: {
                doctorId,
                date: slotDate,
                slotNumber,
                status: "available",
            },
        });
        if (!existingSlot) {
            throw new Error("Slot not available or does not exist");
        }
        const updatedSlot = yield prisma_1.default.slot.update({
            where: { id: existingSlot.id },
            data: { status: "booked" },
        });
        return res.status(200).json({ status: status_1.Status.SUCCESS, data: updatedSlot });
    }
    catch (error) {
        console.error("Error booking slot:", error);
        return res
            .status(500)
            .json({ status: status_1.Status.ERROR, message: error.message });
    }
});
exports.bookSlot = bookSlot;
//# sourceMappingURL=slot.js.map