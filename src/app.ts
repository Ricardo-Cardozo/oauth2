import express, { Request, Response, NextFunction } from "express";
import oauthServer from "./oauth/server";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post(
  "/auth/login",
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("Rota /auth/login acionada"); // Teste rota

    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username e senha são obrigatórios" });
    }

    return oauthServer.token()(req, res, next);
  }
);

app.get("/", async (req: Request, res: Response) => {
  return res.json({ message: "Olá mundo" });
});

// Inicie o servidor
app.listen(3001, () => console.log("Server started on port 3001"));
