"use strict";
// prismaSingleton.ts
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
class PrismaSingleton {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    static getInstance() {
        if (!PrismaSingleton.instance) {
            PrismaSingleton.instance = new PrismaSingleton();
        }
        return PrismaSingleton.instance;
    }
    getPrisma() {
        return this.prisma;
    }
}
PrismaSingleton.instance = null;
const prismaInstance = PrismaSingleton.getInstance();
exports.default = prismaInstance.getPrisma();
//# sourceMappingURL=prisma.js.map