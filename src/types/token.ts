import { Client, User } from "@prisma/client";

export interface IToken {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  clientName: string;
  username: string;
  scope: string;
  revoked: boolean;
}

export interface IReturnData {
  user: User;
  client: Client;
  accessToken: string;
}
