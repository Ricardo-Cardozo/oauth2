import express, { Request, Response, NextFunction } from "express";
import oauthServer from "./oauth/server";
import model from "./oauth/model";
import prismadb from "./lib/prismadb";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post(
  "/auth/login",
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("Rota /auth/login acionada");

    const { username, password } = req.body;
    const { authorization } = req.headers;

    if (!username || !password || !authorization) {
      return res.status(400).json({
        message: "Username, senha e cabeçalho de autorização são obrigatórios",
      });
    }

    // Extrai o ID do cliente e o segredo do cliente do cabeçalho de autorização
    const credentials = Buffer.from(authorization.split(" ")[1], "base64")
      .toString("utf8")
      .split(":");
    const clientId = credentials[0];
    const clientSecret = credentials[1];

    // Adicione o ID do cliente, o segredo do cliente e o tipo de concessão ao corpo da solicitação
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
    // Se chegarmos a este ponto, a solicitação é válida e o token de acesso foi verificado.
    res.json({ message: "Esta é uma rota protegida." });
  }
);


app.get("/", async (req: Request, res: Response) => {
  return res.json({ message: "Olá mundo" });
});

app.get(
  "/admin_only",
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
    // Se chegarmos a este ponto, a solicitação é válida e o token de acesso foi verificado.
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

    // Extrai o ID do cliente e o segredo do cliente do cabeçalho de autorização
    const credentials = Buffer.from(authorization.split(" ")[1], "base64")
      .toString("utf8")
      .split(":");
    const clientId = credentials[0];
    const clientSecret = credentials[1];

    // Adicione o ID do cliente, o segredo do cliente e o tipo de concessão ao corpo da solicitação
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

    // Extrai o token de acesso do cabeçalho de autorização
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

    // Use a função revokeToken para invalidar o token de acesso
    await model.revokeToken(token);

    return res.json({ message: "Logout realizado com sucesso." });
  }
);

// Inicie o servidor
app.listen(3001, () => console.log("Server started on port 3001"));
