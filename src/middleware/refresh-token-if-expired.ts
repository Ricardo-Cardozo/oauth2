import axios from "axios";
import { Request, Response, NextFunction } from "express";
import prismadb from "../lib/prismadb";

export default async function refreshTokenIfExpired(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      message: "Cabeçalho de autorização é obrigatório",
    });
  }

  const accessToken = authorization.split(" ")[1];

  const token = await prismadb.token.findUnique({
    where: { accessToken: accessToken },
    include: {
      client: true,
      user: true,
    },
  });

  if (token && token.accessTokenExpires < new Date()) {
    const credentials = `${token.client.id}:${token.client.secret}`;
    const authHeader = `Basic ${Buffer.from(credentials).toString("base64")}`;

    console.log("retorno clientId: ", token.client.id);
    console.log("retorno clientSecret: ", token.client.secret);
    console.log("retorno credentials: ", credentials);
    console.log("retorno credentials: ", authHeader);

    try {
      const data = new URLSearchParams();
      data.append("refresh_token", token.refreshToken);
      data.append("grant_type", "refresh_token");
      const response = await axios.post(
        "http://localhost:3001/auth/refresh_token",
        data.toString(),
        {
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      req.headers.authorization = `Bearer ${response.data.access_token}`;
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erro ao renovar o token",
      });
    }
  }

  next();
}
