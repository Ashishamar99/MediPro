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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileToSupabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = (_a = process.env.SUPABASE_URL) !== null && _a !== void 0 ? _a : "";
const supabaseKey = (_b = process.env.SUPABASE_KEY) !== null && _b !== void 0 ? _b : "";
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
const uploadFileToSupabase = (filename, buffer) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const { error } = yield supabase.storage
        .from((_c = process.env.SUPABASE_BUCKET) !== null && _c !== void 0 ? _c : "")
        .upload(filename, buffer, { contentType: "image/png" });
    const { data } = supabase.storage
        .from((_d = process.env.SUPABASE_BUCKET) !== null && _d !== void 0 ? _d : "")
        .getPublicUrl(filename);
    if (error)
        console.log(error);
    return data;
});
exports.uploadFileToSupabase = uploadFileToSupabase;
//# sourceMappingURL=helper.js.map