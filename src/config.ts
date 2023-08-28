import dotenv from "dotenv";

export default function configEnv(): void {
  const envFile =
    process.env.NODE_ENV === "development"
      ? ".env.development"
      : ".env.production";
  dotenv.config({ path: envFile });
}

export {};
