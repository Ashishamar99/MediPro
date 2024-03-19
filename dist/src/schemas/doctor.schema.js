"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorRegisterSchema = void 0;
const zod_1 = require("zod");
const user_schema_1 = require("./user.schema");
exports.doctorRegisterSchema = zod_1.z.object({
    file: zod_1.z
        .any()
        .refine((file) => typeof file !== typeof File, `File is required`),
    body: user_schema_1.userSchema,
});
//# sourceMappingURL=doctor.schema.js.map