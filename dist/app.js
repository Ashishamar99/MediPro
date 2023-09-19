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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const supabase_js_1 = require("@supabase/supabase-js");
dotenv_1.default.config();
const app = (0, express_1.default)();
const patient_1 = __importDefault(require("./src/routes/patient"));
const doctor_1 = __importDefault(require("./src/routes/doctor"));
const booking_1 = __importDefault(require("./src/routes/booking"));
const consultation_1 = __importDefault(require("./src/routes/consultation"));
const appointment_1 = __importDefault(require("./src/routes/appointment"));
const ivr_1 = __importDefault(require("./src/routes/ivr"));
const prisma_1 = __importDefault(require("./src/database/prisma"));
const logger_1 = __importDefault(require("./src/logger"));
const port = process.env.PORT || 5001;
const supabaseUrl = "https://mqgjmethwijueomqahit.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xZ2ptZXRod2lqdWVvbXFhaGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE5NTEwNTgsImV4cCI6MjAwNzUyNzA1OH0.W7L4RT47WGSfpi5g-43HI9WbUMPSGCx1rpYCAsZokMs";
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
function uploadFile() {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabase.storage
            .from("medipro-signatures") // Replace 'bucket_name' with your actual bucket name
            .upload("Kav.jpg", "Kav.jpg", { contentType: "image/jpeg" });
        if (error) {
            console.error("Error uploading file:", error.message);
        }
        else {
            console.log("File uploaded successfully:");
            const { data } = supabase.storage
                .from("medipro-signatures")
                .getPublicUrl("Kav.jpg");
            console.log(data);
        }
    });
}
uploadFile();
app.use((0, cors_1.default)({ origin: "*" }));
app.use(body_parser_1.default.json({ limit: "50mb" }));
app.get("/health", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const doctors = yield prisma_1.default.doctor.findMany();
    console.log(doctors);
    res.json({ uptime: process.uptime(), message: "OK", timestamp: new Date() });
}));
app.use("/patient", patient_1.default);
app.use("/doctor", doctor_1.default);
app.use("/booking", booking_1.default);
app.use("/consultation", consultation_1.default);
app.use("/appointment", appointment_1.default);
app.use("/ivr", ivr_1.default);
app.listen(port, () => {
    logger_1.default.info(`Application started at port ${port}`);
});
//# sourceMappingURL=app.js.map