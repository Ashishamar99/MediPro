"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const config = {
    client: 'mysql',
    connection: {
        connectionString: process.env.DB_CONNECTION_STRING,
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        ssl: { rejectUnauthorized: false }
    }
};
exports.default = (0, knex_1.default)(config);
//# sourceMappingURL=knex.js.map