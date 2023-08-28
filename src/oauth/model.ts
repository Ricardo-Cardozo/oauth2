import { IToken, IReturnData } from "./../types/token";
import prismadb from "../lib/prismadb";
import { User, Client } from "@prisma/client";
import { compare } from "bcrypt";

const getClientData = (client: Client) => ({
  id: client.name,
  clientSecret: client.secret,
  grants: ["password", "refresh_token"],
});

const getUserData = (user: User) => ({
  id: user.id.toString(),
  username: user.username,
  type: user.type,
});

const model = {
  getClient: async function (clientId: string, clientSecret: string) {
    console.log("Função getClient acionada getClient");

    const client = await prismadb.client.findFirst({
      where: { name: clientId },
    });

    if (!client || client.secret !== clientSecret) {
      console.log("nenhum client encontrado");
      return null;
    }

    console.log("retorno client: ", client);
    console.log("retorno do getClientData", getClientData(client));

    return getClientData(client);
  },

  getUser: async function (username: string, password: string) {
    console.log("Função getUser acionado");

    console.log("username: ", username);
    console.log("password: ", password);

    const user = await prismadb.user.findUnique({
      where: { username: username },
    });

    console.log("retorno do usuário: ", user);

    if (!user) {
      console.log("Usuário não encontrado!");
      return null;
    }

    const match = await compare(password, user.password);

    if (!match) {
      console.log("Senha incorreta!");
      return null;
    }

    console.log("retorno getUserData: ", getUserData(user));

    return getUserData(user);
  },

  saveToken: async function (token: any, client: any, user: any) {
    console.log("Função saveToken acionado");

    console.log("Retorno type: ", user.type);

    const createdToken = await prismadb.token.create({
      data: {
        accessToken: token.accessToken,
        accessTokenExpires: token.accessTokenExpiresAt,
        refreshToken: token.refreshToken,
        refreshTokenExpires: token.refreshTokenExpiresAt,
        client: { connect: { name: client.id.toString() } },
        user: { connect: { username: user.username } },
        scope: user.type,
      },
    });

    console.log("Token criado: ", createdToken);

    return {
      ...token,
      client: getClientData(client),
      user: getUserData(user),
      scope: user.type,
    };
  },
  getAccessToken: async function (accessToken: string) {
    console.log("Função getAccessToken acionado");
    const token = await prismadb.token.findUnique({
      where: { accessToken: accessToken },
      include: {
        user: true,
        client: true,
      },
    });

    if (!token) {
      console.log("Token não encontrado!");
      return null;
    }

    return {
      accessToken: token.accessToken,
      client: getClientData(token.client),
      user: getUserData(token.user),
      accessTokenExpiresAt: token.accessTokenExpires,
      scope: token.scope,
    };
  },

  getRefreshToken: async function (refreshToken: string) {
    console.log("Função getRefreshToken acionado");
    const token = await prismadb.token.findUnique({
      where: { refreshToken: refreshToken },
      include: {
        user: true,
        client: true,
      },
    });

    if (!token) {
      console.log("Refresh Token não encontrado!");
      return null;
    }

    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      client: getClientData(token.client),
      user: getUserData(token.user),
      refreshTokenExpiresAt: token.refreshTokenExpires,
      scope: token.scope,
    };
  },

  revokeToken: async function (token: any) {
    const revokedToken = await prismadb.token.update({
      where: { accessToken: token.accessToken },
      data: { revoked: true },
    });

    return !!revokedToken;
  },

  verifyScope: async function (token: any, scope: string) {
    console.log("Função verifyScope acionado");

    if (token.scope === scope) {
      return true;
    }

    console.log("Escopo do token inválido!");
    return false;
  },
};

export default model;
