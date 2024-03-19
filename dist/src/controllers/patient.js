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
exports.getPatientWithID = exports.getPatientsList = exports.handlePatientLogin = exports.updatePatientRegister = exports.handlePatientRegister = void 0;
const status_1 = require("../common/status");
const prisma_1 = __importDefault(require("../config/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const handlePatientRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const patient = req.body.user;
    try {
        const user = yield prisma_1.default.patient.findUnique({
            where: { phone: req.body.user.phone },
        });
        if (user) {
            return res
                .status(400)
                .json({ status: status_1.Status.FAILED, message: "User already exists" });
        }
        patient.password = yield bcryptjs_1.default.hash(patient.password, 10);
        const response = yield prisma_1.default.patient.create({ data: patient });
        return res.status(201).json({
            status: status_1.Status.SUCCESS,
            message: "Patient registered successfully",
            data: Object.assign(Object.assign({}, response), { password: undefined }),
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ status: status_1.Status.ERROR, message: err });
    }
});
exports.handlePatientRegister = handlePatientRegister;
const updatePatientRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, id, phone, gender, age } = req.body.user;
    const patient = {
        name,
        phone,
        age,
        gender,
        id,
    };
    try {
        const result = yield prisma_1.default.patient.update({
            where: {
                id,
            },
            data: Object.assign({}, patient),
        });
        return res
            .status(200)
            .json({ status: status_1.Status.SUCCESS, data: { id: patient.id } });
    }
    catch (err) {
        return res.status(500).json({ status: status_1.Status.ERROR, message: err });
    }
});
exports.updatePatientRegister = updatePatientRegister;
const handlePatientLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone, password } = req.body.user;
    try {
        const patient = yield prisma_1.default.patient.findUnique({ where: { phone } });
        if (!patient) {
            return res
                .status(404)
                .json({ status: status_1.Status.FAILED, message: "User not found" });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, patient.password);
        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ status: status_1.Status.FAILED, message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ phone }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        return res.status(200).json({
            status: status_1.Status.SUCCESS,
            message: "Login successful",
            data: { token, id: patient.id },
        });
    }
    catch (err) {
        return res.status(500).json({ status: status_1.Status.ERROR, message: err });
    }
});
exports.handlePatientLogin = handlePatientLogin;
const getPatientsList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.json({
            status: status_1.Status.SUCCESS,
            data: yield prisma_1.default.patient.findMany({
                select: { id: true, name: true, phone: true },
            }),
        });
    }
    catch (err) {
        res.status(500).json({ status: status_1.Status.ERROR, message: err });
    }
});
exports.getPatientsList = getPatientsList;
/**
 * Get patient details by id
 * @param req
 * @param res
 * @returns
 * @name getPatientWithID
 * @description Get patient details by id
 */
const getPatientWithID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const data = yield prisma_1.default.patient.findUnique({ where: { id } });
        return res.json({
            status: status_1.Status.SUCCESS,
            data: Object.assign(Object.assign({}, data), { password: undefined }),
        });
    }
    catch (err) {
        res.status(500).json({ status: status_1.Status.ERROR, message: err });
    }
});
exports.getPatientWithID = getPatientWithID;
//# sourceMappingURL=patient.js.map