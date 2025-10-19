import * as dotenv from "dotenv";

const ENV = process.env.ENV;
export const envFilePath = `.env.${ENV ?? "local"}`;

dotenv.config({ path: envFilePath });

export default () => ({
  PORT: process.env.PORT || 8123,
  DB_NAME: process.env.POSTGRES_DB || "",
  DB_PORT: process.env.POSTGRES_PORT || 5432,
  DB_HOST: process.env.POSTGRES_HOST || "",
  DB_USERNAME: process.env.POSTGRES_USERNAME || "",
  DB_PASSWORD: process.env.POSTGRES_PASSWORD || "",
  DB_SCHEMA: process.env.POSTGRES_SCHEMA || "public",
  OAUTH2_CLIENT_ID: process.env.OAUTH2_CLIENT_ID || "",
  OAUTH2_CLIENT_SECRET: process.env.OAUTH2_CLIENT_SECRET || "",
  OAUTH2_REDIRECT_URI: process.env.OAUTH2_REDIRECT_URI || "",
  OAUTH2_API_URL: process.env.OAUTH2_API_URL || "",
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET || "",
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET || "",
  JWT_ACCESS_TOKEN_EXPIRES_IN_MINUTES: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN_MINUTES || 60,
  JWT_REFRESH_TOKEN_EXPIRES_IN_MINUTES: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN_MINUTES || 10080,
  UPLOAD_RELATIVE_DIR: process.env.UPLOAD_RELATIVE_DIR || "uploads",
  EMAIL_APP_PASSWORD: process.env.EMAIL_APP_PASSWORD || "",
  EMAIL_NAME: process.env.EMAIL_NAME || "",
  REDIS_HOST: process.env.REDIS_HOST || "",
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  REDIS_URL: process.env.REDIS_URL || "",
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || "",
  URL_SERVER: process.env.URL_SERVER || "",
  URL_CLIENT: process.env.URL_CLIENT || "",
});
