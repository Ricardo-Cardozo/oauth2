"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var prismadb_1 = __importDefault(require("../lib/prismadb"));
function refreshTokenIfExpired(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var authorization, accessToken, token, credentials, authHeader, data, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    authorization = req.headers.authorization;
                    if (!authorization) {
                        return [2 /*return*/, res.status(401).json({
                                message: "Cabeçalho de autorização é obrigatório",
                            })];
                    }
                    accessToken = authorization.split(" ")[1];
                    return [4 /*yield*/, prismadb_1.default.token.findUnique({
                            where: { accessToken: accessToken },
                            include: {
                                client: true,
                                user: true,
                            },
                        })];
                case 1:
                    token = _a.sent();
                    if (!(token && token.accessTokenExpires < new Date())) return [3 /*break*/, 5];
                    credentials = "".concat(token.client.id, ":").concat(token.client.secret);
                    authHeader = "Basic ".concat(Buffer.from(credentials).toString("base64"));
                    console.log("retorno clientId: ", token.client.id);
                    console.log("retorno clientSecret: ", token.client.secret);
                    console.log("retorno credentials: ", credentials);
                    console.log("retorno credentials: ", authHeader);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    data = new URLSearchParams();
                    data.append("refresh_token", token.refreshToken);
                    data.append("grant_type", "refresh_token");
                    return [4 /*yield*/, axios_1.default.post("http://localhost:3001/auth/refresh_token", data.toString(), {
                            headers: {
                                Authorization: authHeader,
                                "Content-Type": "application/x-www-form-urlencoded",
                            },
                        })];
                case 3:
                    response = _a.sent();
                    req.headers.authorization = "Bearer ".concat(response.data.access_token);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [2 /*return*/, res.status(500).json({
                            message: "Erro ao renovar o token",
                        })];
                case 5:
                    next();
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = refreshTokenIfExpired;
