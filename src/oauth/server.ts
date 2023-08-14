import OAuthServer from "express-oauth-server";
import model from "./model";

const oauth = new OAuthServer({
  model: model,
  accessTokenLifetime: 60 * 60 * 24,
  allowEmptyState: false,
  allowExtendedTokenAttributes: true,
});

export default oauth;
