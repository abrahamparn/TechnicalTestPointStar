import { config as loadEnv } from "dotenv";
import { z } from "zod";

loadEnv({ override: true });

//contract for all required variables
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  PORT: z.string().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  LOG_LEVEL: z.string().default("info"),
  BCRYPT_ROUNDS: z.string().default("10").transform(Number),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535),
  SMTP_PASS: z.string().min(16, { message: "SMTP_PASS must be ≥ 16 characters" }),
  EMAIL_FROM: z.string(),
  SMTP_USER: z.string().email(),
  JWT_ACCESS_TTL: z.string(),
  JWT_REFRESH_TTL: z.string(),
  DEVELOPMENT_URL: z.string(),
  MODEL_TOKEN: z.string(),
  AI_ENPOINT: z.string(),
  MODEL_NAME: z.string(),
});

// validate at runtime
const _env = envSchema.safeParse(process.env);
if (!_env.success) {
  console.error("❌  Invalid environment variables:\n", _env.error.format());
  process.exit(1);
}

export const env = _env.data;
