"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_oauth_server_1 = __importDefault(require("express-oauth-server"));
var model_1 = __importDefault(require("./model"));
var oauth = new express_oauth_server_1.default({
    model: model_1.default,
    accessTokenLifetime: 60 * 60 * 24,
    allowEmptyState: false,
    allowExtendedTokenAttributes: true,
});
exports.default = oauth;
