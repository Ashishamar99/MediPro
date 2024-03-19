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
exports.deleteDoctorWithID = exports.getDoctorWithRole = exports.handleDoctorRegister = exports.handleDoctorLogin = exports.getDoctorWithID = exports.getDoctorsList = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const crypto_1 = require("crypto");
const status_1 = require("../common/status");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const doctor_schema_1 = require("../schemas/doctor.schema");
const supabase_1 = __importDefault(require("../config/supabase"));
const getDoctorsList = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.json({
            status: "Success",
            data: yield prisma_1.default.doctor.findMany(),
        });
    }
    catch (error) {
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
});
exports.getDoctorsList = getDoctorsList;
const getDoctorWithID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const doctor = yield prisma_1.default.doctor.findUnique({ where: { id } });
        return res.json(Object.assign(Object.assign({ status: status_1.Status.SUCCESS }, doctor), { password: undefined }));
    }
    catch (err) {
        return res.json({ status: status_1.Status.ERROR, message: err });
    }
});
exports.getDoctorWithID = getDoctorWithID;
/**
 * Function to handle doctor login
 * @param req - Request
 * @param res - Response
 * @returns  Response
 */
const handleDoctorLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(process.env.DATABASE_URL);
    const { phone, password } = req.body;
    const doctor = yield prisma_1.default.doctor.findUnique({ where: { phone } });
    if (!doctor) {
        return res
            .status(404)
            .json({ status: status_1.Status.FAILED, message: "User not found" });
    }
    const isPasswordValid = yield bcryptjs_1.default.compare(password, doctor.password);
    if (!isPasswordValid) {
        return res
            .status(401)
            .json({ status: status_1.Status.FAILED, message: "Invalid credentials" });
    }
    try {
        const token = jsonwebtoken_1.default.sign({ phone }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        return res.status(200).json({
            status: status_1.Status.SUCCESS,
            message: "Login successful",
            data: { token, id: doctor.id },
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ status: status_1.Status.ERROR, message: err });
    }
});
exports.handleDoctorLogin = handleDoctorLogin;
const handleDoctorRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.body.user === "string") {
        req.body.user = JSON.parse(req.body.user);
    }
    const result = doctor_schema_1.doctorRegisterSchema.safeParse(req);
    if (!result.success) {
        return res
            .status(400)
            .json({ status: status_1.Status.FAILED, code: 400, message: result.error });
    }
    try {
        let doctor = yield prisma_1.default.doctor.findUnique({
            where: { phone: req.body.user.phone },
        });
        if (doctor) {
            return res
                .status(400)
                .json({ status: status_1.Status.FAILED, message: "User already exists" });
        }
        doctor = yield handleSignatureFileUpload({
            file: req.file,
            body: req.body,
        });
        doctor.password = yield bcryptjs_1.default.hash(doctor.password, 10);
        const response = yield prisma_1.default.doctor.create({ data: doctor });
        return res.status(201).json({
            status: status_1.Status.SUCCESS,
            message: "Doctor registered successfully",
            data: Object.assign(Object.assign({}, response), { password: undefined }),
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ status: status_1.Status.ERROR, message: err });
    }
});
exports.handleDoctorRegister = handleDoctorRegister;
const getDoctorWithRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const role = req.body.role;
    if (!role) {
        return res
            .status(400)
            .json({ status: status_1.Status.FAILED, message: "Role is required" });
    }
    const doctor = yield prisma_1.default.doctor.findFirst({ where: { role } });
    return res
        .status(200)
        .json({ status: status_1.Status.SUCCESS, data: Object.assign(Object.assign({}, doctor), { password: undefined }) });
});
exports.getDoctorWithRole = getDoctorWithRole;
const deleteDoctorWithID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const doctor = yield prisma_1.default.doctor.findUnique({
        where: { id },
    });
    if (doctor === null) {
        return res
            .status(404)
            .json({ status: "Not found", message: "No doctor found for given id" });
    }
    yield supabase_1.default.storage
        .from("medipro-signatures")
        .remove([doctor.signatureFilename]);
    //using raw query to delete as there is a bug in prisma delete on cascade
    const data = yield prisma_1.default.$queryRaw `DELETE FROM "Doctor" WHERE id = ${id}`;
    return res.json({
        status: "Success",
        message: "Doctor deleted successfully",
        id,
    });
});
exports.deleteDoctorWithID = deleteDoctorWithID;
const handleSignatureFileUpload = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { user } = req.body;
    const filename = `${Date.now().toString()}-${req.file.originalname}`;
    const bucket = (_a = process.env.SUPABASE_SIGNATURES_BUCKET) !== null && _a !== void 0 ? _a : "misc";
    try {
        const { error } = yield supabase_1.default.storage
            .from(bucket)
            .upload(filename, req.file.buffer, { contentType: "image/png" });
        if (error)
            throw error;
        const { data } = supabase_1.default.storage.from(bucket).getPublicUrl(filename);
        user.signatureUrl = data.publicUrl;
        user.signatureFilename = filename;
        user.id = user.id || (0, crypto_1.randomUUID)();
        return user;
    }
    catch (err) {
        return err;
    }
});
//# sourceMappingURL=doctor.js.map