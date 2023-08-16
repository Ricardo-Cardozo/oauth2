import express, { Request, Response, NextFunction } from "express";
import oauthServer from "./oauth/server";
import model from "./oauth/model";
import prismadb from "./lib/prismadb";
import cors from "cors";
import refreshTokenIfExpired from "./middleware/refresh-token-if-expired";
import { compare, genSalt, hash } from "bcrypt";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.post("/newuser", async (req: Request, res: Response) => {
  const { username, password, name, status, type, id = 1 } = req.body;

  const salt = await genSalt(12);
  const passwordHash = await hash(password, salt);

  const user = await prismadb.user.create({
    data: {
      name,
      username,
      password: passwordHash,
      status,
      type,
      idUserCreated: id,
      idUserUpdated: id,
    },
  });

  return res.status(200).json({ user, message: "Usuário criado com sucesso" });
});

app.post(
  "/auth/login",
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("Rota /auth/login acionada");

    const { username, password } = req.body;
    const { authorization } = req.headers;

    if (!username || !password || !authorization) {
      return res.status(400).json({
        message: "Usuário e senha são obrigatórios.",
      });
    }

    const userExists = await prismadb.user.findUnique({
      where: { username: username },
    });

    if (!userExists) {
      console.log("Erro na autenticação.");
      return res.status(400).json({
        message: "Erro na autenticação.",
      });
    }

    console.log(userExists.password);

    const match = await compare(password, userExists.password);

    if (!match) {
      console.log("Senha incorreta!");
      return res.status(400).json({
        message: "Erro na autenticação.",
      });
    }

    const credentials = Buffer.from(authorization.split(" ")[1], "base64")
      .toString("utf8")
      .split(":");
    const clientId = credentials[0];
    const clientSecret = credentials[1];

    req.body.client_id = clientId;
    req.body.client_secret = clientSecret;
    req.body.grant_type = "password";

    return oauthServer.token({
      requireClientAuthentication: { password: true },
    })(req, res, next);
  }
);

app.get(
  "/protected",
  refreshTokenIfExpired,
  oauthServer.authenticate(),
  async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({
        message: "Cabeçalho de autorização é obrigatório",
      });
    }

    const accessToken = authorization.split(" ")[1];

    const token = await prismadb.token.findUnique({
      where: { accessToken: accessToken },
    });

    if (token && token.revoked) {
      return res.status(403).json({
        message: "Token revogado",
      });
    }

    next();
  },
  (req, res) => {
    res.json({ message: "Esta é uma rota protegida." });
  }
);

app.get("/", async (req: Request, res: Response) => {
  return res.json({ message: "Olá mundo" });
});

app.get(
  "/admin_only",
  refreshTokenIfExpired,
  oauthServer.authenticate({ scope: "admin" }),
  async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({
        message: "Cabeçalho de autorização é obrigatório",
      });
    }

    const accessToken = authorization.split(" ")[1];

    const token = await prismadb.token.findUnique({
      where: { accessToken: accessToken },
    });

    if (token && token.revoked) {
      return res.status(403).json({
        message: "Token revogado",
      });
    }

    next();
  },
  (req, res) => {
    res.json({ message: "Esta é uma rota apenas para admin." });
  }
);

app.post(
  "/auth/refresh_token",
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("Rota /auth/refresh_token acionada");

    const { refresh_token } = req.body;
    const { authorization } = req.headers;

    if (!refresh_token || !authorization) {
      return res.status(400).json({
        message: "Refresh token e cabeçalho de autorização são obrigatórios",
      });
    }

    const credentials = Buffer.from(authorization.split(" ")[1], "base64")
      .toString("utf8")
      .split(":");
    const clientId = credentials[0];
    const clientSecret = credentials[1];

    req.body.client_id = clientId;
    req.body.client_secret = clientSecret;
    req.body.grant_type = "refresh_token";
    req.body.refresh_token = refresh_token;

    return oauthServer.token({
      requireClientAuthentication: { refresh_token: true },
    })(req, res, next);
  }
);

app.post(
  "/auth/logout",
  oauthServer.authenticate(),
  async (req: Request, res: Response) => {
    console.log("Rota /auth/logout acionada");

    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(400).json({
        message: "Cabeçalho de autorização é obrigatório",
      });
    }

    const accessToken = authorization.split(" ")[1];

    const token = await prismadb.token.findUnique({
      where: { accessToken: accessToken },
      include: {
        user: true,
        client: true,
      },
    });

    if (!token) {
      return res.status(400).json({
        message: "Token inválido",
      });
    }

    await model.revokeToken(token);

    return res.json({ message: "Logout realizado com sucesso." });
  }
);

app.get(
  "/user",
  refreshTokenIfExpired,
  oauthServer.authenticate(),
  async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({
        message: "Cabeçalho de autorização é obrigatório",
      });
    }

    const accessToken = authorization.split(" ")[1];

    const token = await prismadb.token.findUnique({
      where: { accessToken: accessToken },
      include: { user: true },
    });

    if (!token || token.revoked) {
      return res.status(403).json({
        message: "Token inválido ou revogado",
      });
    }

    res.json(token.user);
  }
);

// Inicie o servidor
app.listen(3001, () => console.log("Server started on port 3001"));
