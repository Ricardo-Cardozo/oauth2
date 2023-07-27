import OAuthServer from "express-oauth-server";
import model from "./model";

const oauth = new OAuthServer({
  model: model,
  accessTokenLifetime: 60 * 60 * 24, // 24 hours, or 1 day
  allowEmptyState: false,
  allowExtendedTokenAttributes: true,
});

export default oauth;
