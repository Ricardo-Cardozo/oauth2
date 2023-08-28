"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
function configEnv() {
    var envFile = process.env.NODE_ENV === "development"
        ? ".env.development"
        : ".env.production";
    dotenv_1.default.config({ path: envFile });
}
exports.default = configEnv;
