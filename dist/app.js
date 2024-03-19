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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const node_cron_1 = __importDefault(require("node-cron"));
const patient_1 = __importDefault(require("./routes/patient"));
const doctor_1 = __importDefault(require("./routes/doctor"));
const slot_1 = __importDefault(require("./routes/slot"));
const consultation_1 = __importDefault(require("./routes/consultation"));
const appointment_1 = __importDefault(require("./routes/appointment"));
const logger_1 = __importDefault(require("./logger"));
const prisma_1 = __importDefault(require("./database/prisma"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 5002;
app.use((0, cors_1.default)({ origin: "*" }));
app.use(body_parser_1.default.json({ limit: "5mb" }));
app.get("/health", (_req, res) => {
    res.json({ uptime: process.uptime(), message: "OK", timestamp: new Date() });
});
app.use("/patient", patient_1.default);
app.use("/doctor", doctor_1.default);
app.use("/slot", slot_1.default);
app.use("/consultation", consultation_1.default);
app.use("/appointment", appointment_1.default);
app.listen(port, () => {
    logger_1.default.info(`Application started at port ${port}`);
});
node_cron_1.default.schedule('0 0 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info('Running a task every day at midnight');
    // reset slot status to available everyday at midnight
    const slots = yield prisma_1.default.slot.updateMany({
        where: {
            status: "booked",
        },
        data: {
            status: "available",
        },
    });
    logger_1.default.info(`Reset ${slots.count} slots to available`);
}));
exports.default = app;
//# sourceMappingURL=app.js.map