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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const supabase_js_1 = require("@supabase/supabase-js");
const patient_1 = __importDefault(require("./src/routes/patient"));
const doctor_1 = __importDefault(require("./src/routes/doctor"));
const booking_1 = __importDefault(require("./src/routes/booking"));
const consultation_1 = __importDefault(require("./src/routes/consultation"));
const appointment_1 = __importDefault(require("./src/routes/appointment"));
const prisma_1 = __importDefault(require("./src/database/prisma"));
const logger_1 = __importDefault(require("./src/logger"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 5001;
const supabaseUrl = (_b = process.env.SUPABASE_URL) !== null && _b !== void 0 ? _b : '';
const supabaseKey = (_c = process.env.SUPABASE_KEY) !== null && _c !== void 0 ? _c : '';
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
function uploadFile() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabase.storage
            .from((_a = process.env.SUPABASE_BUCKET) !== null && _a !== void 0 ? _a : '') // Replace 'bucket_name' with your actual bucket name
            .upload('', '', { contentType: 'image/jpeg' });
        console.log(data);
        if (error) {
            console.error('Error uploading file:', error.message);
        }
        else {
            console.log('File uploaded successfully:');
            const { data } = supabase.storage
                .from((_b = process.env.SUPABASE_BUCKET) !== null && _b !== void 0 ? _b : '')
                .getPublicUrl('');
            console.log(data);
        }
    });
}
uploadFile().then(() => { }).catch(console.log);
app.use((0, cors_1.default)({ origin: '*' }));
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.get('/health', (_req, res) => {
    prisma_1.default.doctor
        .findMany()
        .then((doctors) => {
        console.log(doctors);
        res.json({ uptime: process.uptime(), message: 'OK', timestamp: new Date() });
    })
        .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    });
});
app.use('/patient', patient_1.default);
app.use('/doctor', doctor_1.default);
app.use('/booking', booking_1.default);
app.use('/consultation', consultation_1.default);
app.use('/appointment', appointment_1.default);
app.listen(port, () => {
    logger_1.default.info(`Application started at port ${port}`);
});
//# sourceMappingURL=app.js.map