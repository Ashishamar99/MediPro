"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const patient_1 = __importDefault(require("./routes/patient"));
const doctor_1 = __importDefault(require("./routes/doctor"));
const slot_1 = __importDefault(require("./routes/slot"));
const consultation_1 = __importDefault(require("./routes/consultation"));
const appointment_1 = __importDefault(require("./routes/appointment"));
const logger_1 = __importDefault(require("./logger"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 5002;
app.use((0, cors_1.default)({ origin: "*" }));
app.use(body_parser_1.default.json({ limit: "5mb" }));
app.get("/health", (_req, res) => {
    res.json({ uptime: process.uptime(), message: "OK", timestamp: new Date() });
});
app.use("/api/patient", patient_1.default);
app.use("/api/doctor", doctor_1.default);
app.use("/api/slot", slot_1.default);
app.use("/api/consultation", consultation_1.default);
app.use("/api/appointment", appointment_1.default);
app.listen(port, () => {
    logger_1.default.info(`Application started at port ${port}`);
});
exports.default = app;
//# sourceMappingURL=app.js.map