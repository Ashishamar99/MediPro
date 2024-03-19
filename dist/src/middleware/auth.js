"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const status_1 = require("../common/status");
const auth = (req, res, next) => {
    var _a;
    const authHeader = req.header("Authorization");
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
    if (token == null) {
        return res
            .status(401)
            .json({ status: status_1.Status.ERROR, message: "Unauthorized access" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "");
        // @ts-ignore
        req.user = decoded;
        next();
    }
    catch (error) {
        return res
            .status(401)
            .json({ status: status_1.Status.ERROR, message: "Unauthorized access" });
    }
};
exports.auth = auth;
//# sourceMappingURL=auth.js.map