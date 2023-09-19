"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const doctorController = __importStar(require("../controllers/doctor"));
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
router.get('/', (req, res) => {
    doctorController.getDoctorsList(req, res);
});
router.get('/get-available-doctors', (req, res) => {
    doctorController.getAvailableDoctors(req, res);
});
router.get('/:id', (req, res) => {
    doctorController.getDoctorWithID(req, res);
});
router.post('/get-doctor-with-role', (req, res) => {
    doctorController.getDoctorWithRole(req, res);
});
router.post('/register', upload.single('sign-image'), (req, res) => {
    doctorController.handleDoctorRegister(req, res);
});
router.post('/login', (req, res) => {
    doctorController.handleDoctorLogin(req, res);
});
exports.default = router;
//# sourceMappingURL=doctor.js.map