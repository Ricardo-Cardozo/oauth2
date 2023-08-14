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
var express_1 = __importDefault(require("express"));
var server_1 = __importDefault(require("./oauth/server"));
var model_1 = __importDefault(require("./oauth/model"));
var prismadb_1 = __importDefault(require("./lib/prismadb"));
var cors_1 = __importDefault(require("cors"));
var refresh_token_if_expired_1 = __importDefault(require("./middleware/refresh-token-if-expired"));
var bcrypt_1 = require("bcrypt");
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
var corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use((0, cors_1.default)(corsOptions));
app.post("/auth/login", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, authorization, userExists, match, credentials, clientId, clientSecret;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log("Rota /auth/login acionada");
                _a = req.body, username = _a.username, password = _a.password;
                authorization = req.headers.authorization;
                if (!username || !password || !authorization) {
                    console.log("Username, senha e cabeçalho de autorização são obrigatórios.");
                    return [2 /*return*/, res.status(400).json({
                            message: "Username, senha e cabeçalho de autorização são obrigatórios.",
                        })];
                }
                return [4 /*yield*/, prismadb_1.default.user.findUnique({
                        where: { username: username },
                    })];
            case 1:
                userExists = _b.sent();
                if (!userExists) {
                    console.log("Username, não encontrado.");
                    return [2 /*return*/, res.status(400).json({
                            message: "Username, não encontrado.",
                        })];
                }
                console.log(userExists.password);
                return [4 /*yield*/, (0, bcrypt_1.compare)(password, userExists.password)];
            case 2:
                match = _b.sent();
                if (!match) {
                    console.log("Senha incorreta!");
                    return [2 /*return*/, res.status(400).json({
                            message: "Senha incorreta.",
                        })];
                }
                credentials = Buffer.from(authorization.split(" ")[1], "base64")
                    .toString("utf8")
                    .split(":");
                clientId = credentials[0];
                clientSecret = credentials[1];
                req.body.client_id = clientId;
                req.body.client_secret = clientSecret;
                req.body.grant_type = "password";
                return [2 /*return*/, server_1.default.token({
                        requireClientAuthentication: { password: true },
                    })(req, res, next)];
        }
    });
}); });
app.get("/protected", refresh_token_if_expired_1.default, server_1.default.authenticate(), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authorization, accessToken, token;
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
                    })];
            case 1:
                token = _a.sent();
                if (token && token.revoked) {
                    return [2 /*return*/, res.status(403).json({
                            message: "Token revogado",
                        })];
                }
                next();
                return [2 /*return*/];
        }
    });
}); }, function (req, res) {
    res.json({ message: "Esta é uma rota protegida." });
});
app.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, res.json({ message: "Olá mundo" })];
    });
}); });
app.get("/admin_only", refresh_token_if_expired_1.default, server_1.default.authenticate({ scope: "admin" }), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authorization, accessToken, token;
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
                    })];
            case 1:
                token = _a.sent();
                if (token && token.revoked) {
                    return [2 /*return*/, res.status(403).json({
                            message: "Token revogado",
                        })];
                }
                next();
                return [2 /*return*/];
        }
    });
}); }, function (req, res) {
    res.json({ message: "Esta é uma rota apenas para admin." });
});
app.post("/auth/refresh_token", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var refresh_token, authorization, credentials, clientId, clientSecret;
    return __generator(this, function (_a) {
        console.log("Rota /auth/refresh_token acionada");
        refresh_token = req.body.refresh_token;
        authorization = req.headers.authorization;
        if (!refresh_token || !authorization) {
            return [2 /*return*/, res.status(400).json({
                    message: "Refresh token e cabeçalho de autorização são obrigatórios",
                })];
        }
        credentials = Buffer.from(authorization.split(" ")[1], "base64")
            .toString("utf8")
            .split(":");
        clientId = credentials[0];
        clientSecret = credentials[1];
        req.body.client_id = clientId;
        req.body.client_secret = clientSecret;
        req.body.grant_type = "refresh_token";
        req.body.refresh_token = refresh_token;
        return [2 /*return*/, server_1.default.token({
                requireClientAuthentication: { refresh_token: true },
            })(req, res, next)];
    });
}); });
app.post("/auth/logout", server_1.default.authenticate(), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authorization, accessToken, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Rota /auth/logout acionada");
                authorization = req.headers.authorization;
                if (!authorization) {
                    return [2 /*return*/, res.status(400).json({
                            message: "Cabeçalho de autorização é obrigatório",
                        })];
                }
                accessToken = authorization.split(" ")[1];
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
                    return [2 /*return*/, res.status(400).json({
                            message: "Token inválido",
                        })];
                }
                return [4 /*yield*/, model_1.default.revokeToken(token)];
            case 2:
                _a.sent();
                return [2 /*return*/, res.json({ message: "Logout realizado com sucesso." })];
        }
    });
}); });
app.get("/user", refresh_token_if_expired_1.default, server_1.default.authenticate(), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authorization, accessToken, token;
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
                        include: { user: true },
                    })];
            case 1:
                token = _a.sent();
                if (!token || token.revoked) {
                    return [2 /*return*/, res.status(403).json({
                            message: "Token inválido ou revogado",
                        })];
                }
                res.json(token.user);
                return [2 /*return*/];
        }
    });
}); });
// Inicie o servidor
app.listen(3001, function () { return console.log("Server started on port 3001"); });
