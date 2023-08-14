"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prismadb = globalThis.prisma || new client_1.PrismaClient();
if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = prismadb;
}
exports.default = prismadb;
