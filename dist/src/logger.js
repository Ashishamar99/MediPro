"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5
};
const logger = (0, winston_1.createLogger)({
    level: 'warn',
    levels: logLevels,
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
    transports: [new winston_1.transports.Console({ level: 'info' })]
});
exports.default = logger;
//# sourceMappingURL=logger.js.map