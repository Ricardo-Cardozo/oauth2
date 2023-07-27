import prismadb from "../lib/prismadb";
import { User, Client } from "@prisma/client";

/* 
  A função getClientData é uma função
  auxiliar usada para formatar e filtrar as informações do cliente 
  que serão retornadas ou usadas pelas outras funções do modelo.
*/
const getClientData = (client: Client) => ({
  id: client.id.toString(),
  clientSecret: client.secret,
  grants: ["password"],

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

    const user = await prismadb.user.findUnique({
      where: { username: username },
    });

    if (!user || user.password !== password) {
      return null;
    }

    return getUserData(user);
  },

  // Cria o token e retorna os dados do token, o client e o user
  saveToken: async function (token: any, client: any, user: any) {
    console.log("Função saveToken acionado");

    const createdToken = await prismadb.token.create({
      data: {
        accessToken: token.accessToken,
        accessTokenExpires: token.accessTokenExpiresAt,
        client: { connect: { id: Number(client.id) } }, // converta de volta para número
        user: { connect: { id: Number(user.id) } }, // converta de volta para número
      },
    });

    console.log("Token criado: ", createdToken); // Adicionado para visualizar o token criado

    return {
      ...token,
      client: getClientData(client),
      user: getUserData(user),
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
    };
  },

  /*
   A função verifyScope neste caso está sendo bastante simplificada
   e não está realmente verificando nada. Em um cenário real, a função verifyScope seria 
   responsável por verificar se o token fornece 
   as permissões ("scopes") necessárias para realizar uma ação específica.
  */
  verifyScope: async function (token: any, scope: any) {
    console.log("Função verifyScope acionado");
    return true;
  },
};

export default model;
