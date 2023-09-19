"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { createLogger, format, transports } = require("winston");
const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
};
const logger = createLogger({
    level: "warn",
    levels: logLevels,
    format: format.combine(format.timestamp(), format.json()),
    transports: [new transports.Console({ level: "info" })],
});
exports.default = logger;
//# sourceMappingURL=logger.js.map