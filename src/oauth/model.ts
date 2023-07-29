import prismadb from "../lib/prismadb";
import { User, Client } from "@prisma/client";
import { compare } from "bcrypt";

/* 
  A função getClientData é uma função
  auxiliar usada para formatar e filtrar as informações do cliente 
  que serão retornadas ou usadas pelas outras funções do modelo.
*/
const getClientData = (client: Client) => ({
  id: client.id.toString(),
  clientSecret: client.secret,
  grants: ["password", "refresh_token"],

  /*
   No contexto deste código, a lista de "grants" é definida 
   como ["password"]. Isso significa que este cliente está autorizado a 
   usar o "Resource Owner Password Credentials Grant", que é um tipo de concessão onde o usuário 
   fornece diretamente suas credenciais (normalmente nome de usuário e senha) para a aplicação cliente. 
   Esta é uma abordagem menos segura que só é recomendada em situações onde o cliente é altamente confiável, 
   como uma aplicação oficial.
   */
});

/* 
  A função getUser é uma função
  auxiliar usada para formatar e filtrar as informações do usuário 
  que serão retornadas ou usadas pelas outras funções do modelo.
*/
const getUserData = (user: User) => ({
  id: user.id.toString(),
  username: user.username,
  type: user.type,
});



const model = {
  // Função para pegar o Client
  getClient: async function (clientId: string, clientSecret: string) {
    console.log("Função getClient acionada getClient"); // Adicione isto

    const client = await prismadb.client.findUnique({
      where: { id: Number(clientId) },
    });

    if (!client || client.secret !== clientSecret) {
      console.log("nenhum client encontrado");
      return null;
    }

    console.log("retorno client: ", client); // teste dados
    console.log("retorno do getClientData", getClientData(client)); // teste dados

    return getClientData(client);
  },

  // Função para pegar o usuário
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

    // Use bcrypt para verificar a senha
    const match = await compare(password, user.password);

    if (!match) {
      console.log("Senha incorreta!");
      return null;
    }

    console.log("retorno getUserData: ", getUserData(user));

    return getUserData(user);
  },

  // Cria o token e retorna os dados do token, o client e o user
  saveToken: async function (token: any, client: any, user: any) {
    console.log("Função saveToken acionado");

    console.log("Retorno type: ", user.type);

    const createdToken = await prismadb.token.create({
      data: {
        accessToken: token.accessToken,
        accessTokenExpires: token.accessTokenExpiresAt,
        refreshToken: token.refreshToken, // adicionado
        refreshTokenExpires: token.refreshTokenExpiresAt, // adicionado
        client: { connect: { id: Number(client.id) } },
        user: { connect: { id: Number(user.id) } },
        scope: user.type,
      },
    });

    console.log("Token criado: ", createdToken); // Adicionado para visualizar o token criado

    return {
      ...token,
      client: getClientData(client),
      user: getUserData(user),
      scope: user.type,
    };
  },

  // Retorna os dados do token, client e user
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
      scope: token.scope, // adicione o escopo do token
    };
  },

  // Função para pegar o refresh token
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
      accessToken: token.accessToken, // incluir isso
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

    return !!revokedToken; // retorna um booleano: true se o token foi revogado com sucesso, false caso contrário
  },

  /*
   A função verifyScope neste caso está sendo bastante simplificada
   e não está realmente verificando nada. Em um cenário real, a função verifyScope seria 
   responsável por verificar se o token fornece 
   as permissões ("scopes") necessárias para realizar uma ação específica.
   */
  verifyScope: async function (token: any, scope: any) {
    console.log("Função verifyScope acionado");

    // Verifique se o escopo do token é o escopo requerido
    if (token.scope === scope) {
      return true;
    }

    console.log("Escopo do token inválido!");
    return false;
  },
};

export default model;
