import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const EnvSchema = z.object({
  PORT: z.coerce.number(),
  DATABASE_URL: z.string(),
  FRONTEND_ORIGIN: z.string(),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  OMDB_API_KEY: z.string(),
});

export const env = EnvSchema.parse(process.env);
