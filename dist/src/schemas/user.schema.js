"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = zod_1.z.object({
    user: zod_1.z.object({
        name: zod_1.z.string(),
        phone: zod_1.z.string().min(10).max(10),
        role: zod_1.z.string(),
        password: zod_1.z.string(),
    }),
});
//# sourceMappingURL=user.schema.js.map