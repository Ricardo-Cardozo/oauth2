"use strict";
// import prismadb from "../lib/prismadb";
// import { User, Client } from "@prisma/client";
// import { compare } from "bcrypt";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
// const getClientData = (client: Client) => ({
//   id: client.id.toString(),
//   clientSecret: client.secret,
//   grants: ["password", "refresh_token"],
// });
// const getUserData = (user: User) => ({
//   id: user.id.toString(),
//   username: user.username,
//   type: user.type,
// });
// const model = {
//   getClient: async function (clientId: string, clientSecret: string) {
//     console.log("Função getClient acionada getClient");
//     const client = await prismadb.client.findUnique({
//       where: { id: Number(clientId) },
//     });
//     if (!client || client.secret !== clientSecret) {
//       console.log("nenhum client encontrado");
//       return null;
//     }
//     console.log("retorno client: ", client);
//     console.log("retorno do getClientData", getClientData(client));
//     return getClientData(client);
//   },
//   getUser: async function (username: string, password: string) {
//     console.log("Função getUser acionado");
//     console.log("username: ", username);
//     console.log("password: ", password);
//     const user = await prismadb.user.findUnique({
//       where: { username: username },
//     });
//     console.log("retorno do usuário: ", user);
//     if (!user) {
//       console.log("Usuário não encontrado!");
//       return null;
//     }
//     const match = await compare(password, user.password);
//     if (!match) {
//       console.log("Senha incorreta!");
//       return null;
//     }
//     console.log("retorno getUserData: ", getUserData(user));
//     return getUserData(user);
//   },
//   saveToken: async function (token: any, client: any, user: any) {
//     console.log("Função saveToken acionado");
//     console.log("Retorno type: ", user.type);
//     const createdToken = await prismadb.token.create({
//       data: {
//         accessToken: token.accessToken,
//         accessTokenExpires: token.accessTokenExpiresAt,
//         refreshToken: token.refreshToken,
//         refreshTokenExpires: token.refreshTokenExpiresAt,
//         client: { connect: { id: Number(client.id) } },
//         user: { connect: { id: Number(user.id) } },
//         scope: user.type,
//       },
//     });
//     console.log("Token criado: ", createdToken);
//     return {
//       ...token,
//       client: getClientData(client),
//       user: getUserData(user),
//       scope: user.type,
//     };
//   },
//   getAccessToken: async function (accessToken: string) {
//     console.log("Função getAccessToken acionado");
//     const token = await prismadb.token.findUnique({
//       where: { accessToken: accessToken },
//       include: {
//         user: true,
//         client: true,
//       },
//     });
//     if (!token) {
//       console.log("Token não encontrado!");
//       return null;
//     }
//     return {
//       accessToken: token.accessToken,
//       client: getClientData(token.client),
//       user: getUserData(token.user),
//       accessTokenExpiresAt: token.accessTokenExpires,
//       scope: token.scope,
//     };
//   },
//   getRefreshToken: async function (refreshToken: string) {
//     console.log("Função getRefreshToken acionado");
//     const token = await prismadb.token.findUnique({
//       where: { refreshToken: refreshToken },
//       include: {
//         user: true,
//         client: true,
//       },
//     });
//     if (!token) {
//       console.log("Refresh Token não encontrado!");
//       return null;
//     }
//     return {
//       accessToken: token.accessToken,
//       refreshToken: token.refreshToken,
//       client: getClientData(token.client),
//       user: getUserData(token.user),
//       refreshTokenExpiresAt: token.refreshTokenExpires,
//       scope: token.scope,
//     };
//   },
//   revokeToken: async function (token: any) {
//     const revokedToken = await prismadb.token.update({
//       where: { accessToken: token.accessToken },
//       data: { revoked: true },
//     });
//     return !!revokedToken;
//   },
//   verifyScope: async function (token: any, scope: any) {
//     console.log("Função verifyScope acionado");
//     if (token.scope === scope) {
//       return true;
//     }
//     console.log("Escopo do token inválido!");
//     return false;
//   },
// };
// export default model;
var prismadb_1 = __importDefault(require("../lib/prismadb"));
var bcrypt_1 = require("bcrypt");
var getClientData = function (client) { return ({
    id: client.name,
    clientSecret: client.secret,
    grants: ["password", "refresh_token"],
}); };
var getUserData = function (user) { return ({
    id: user.id.toString(),
    username: user.username,
    type: user.type,
}); };
var model = {
    getClient: function (clientId, clientSecret) {
        return __awaiter(this, void 0, void 0, function () {
            var client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Função getClient acionada getClient");
                        return [4 /*yield*/, prismadb_1.default.client.findFirst({
                                where: { name: clientId },
                            })];
                    case 1:
                        client = _a.sent();
                        if (!client || client.secret !== clientSecret) {
                            console.log("nenhum client encontrado");
                            return [2 /*return*/, null];
                        }
                        console.log("retorno client: ", client);
                        console.log("retorno do getClientData", getClientData(client));
                        return [2 /*return*/, getClientData(client)];
                }
            });
        });
    },
    getUser: function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var user, match;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Função getUser acionado");
                        console.log("username: ", username);
                        console.log("password: ", password);
                        return [4 /*yield*/, prismadb_1.default.user.findUnique({
                                where: { username: username },
                            })];
                    case 1:
                        user = _a.sent();
                        console.log("retorno do usuário: ", user);
                        if (!user) {
                            console.log("Usuário não encontrado!");
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, (0, bcrypt_1.compare)(password, user.password)];
                    case 2:
                        match = _a.sent();
                        if (!match) {
                            console.log("Senha incorreta!");
                            return [2 /*return*/, null];
                        }
                        console.log("retorno getUserData: ", getUserData(user));
                        return [2 /*return*/, getUserData(user)];
                }
            });
        });
    },
    saveToken: function (token, client, user) {
        return __awaiter(this, void 0, void 0, function () {
            var createdToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Função saveToken acionado");
                        console.log("Retorno type: ", user.type);
                        return [4 /*yield*/, prismadb_1.default.token.create({
                                data: {
                                    accessToken: token.accessToken,
                                    accessTokenExpires: token.accessTokenExpiresAt,
                                    refreshToken: token.refreshToken,
                                    refreshTokenExpires: token.refreshTokenExpiresAt,
                                    client: { connect: { name: client.id } },
                                    user: { connect: { username: user.username } },
                                    scope: user.type,
                                },
                            })];
                    case 1:
                        createdToken = _a.sent();
                        console.log("Token criado: ", createdToken);
                        return [2 /*return*/, __assign(__assign({}, token), { client: getClientData(client), user: getUserData(user), scope: user.type })];
                }
            });
        });
    },
    getAccessToken: function (accessToken) {
        return __awaiter(this, void 0, void 0, function () {
            var token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Função getAccessToken acionado");
                        return [4 /*yield*/, prismadb_1.default.token.findUnique({
                                where: { accessToken: accessToken },
                                include: {
                                    user: true,
                                    client: true,
                                },
                            })];
                    case 1:
                        token = _a.sent();
                        if (!token) {
                            console.log("Token não encontrado!");
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, {
                                accessToken: token.accessToken,
                                client: getClientData(token.client),
                                user: getUserData(token.user),
                                accessTokenExpiresAt: token.accessTokenExpires,
                                scope: token.scope,
                            }];
                }
            });
        });
    },
    getRefreshToken: function (refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Função getRefreshToken acionado");
                        return [4 /*yield*/, prismadb_1.default.token.findUnique({
                                where: { refreshToken: refreshToken },
                                include: {
                                    user: true,
                                    client: true,
                                },
                            })];
                    case 1:
                        token = _a.sent();
                        if (!token) {
                            console.log("Refresh Token não encontrado!");
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, {
                                accessToken: token.accessToken,
                                refreshToken: token.refreshToken,
                                client: getClientData(token.client),
                                user: getUserData(token.user),
                                refreshTokenExpiresAt: token.refreshTokenExpires,
                                scope: token.scope,
                            }];
                }
            });
        });
    },
    revokeToken: function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var revokedToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prismadb_1.default.token.update({
                            where: { accessToken: token.accessToken },
                            data: { revoked: true },
                        })];
                    case 1:
                        revokedToken = _a.sent();
                        return [2 /*return*/, !!revokedToken];
                }
            });
        });
    },
    verifyScope: function (token, scope) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("Função verifyScope acionado");
                if (token.scope === scope) {
                    return [2 /*return*/, true];
                }
                console.log("Escopo do token inválido!");
                return [2 /*return*/, false];
            });
        });
    },
};
exports.default = model;
