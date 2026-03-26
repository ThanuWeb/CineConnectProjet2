import { Pool } from "pg";
import { env } from "../config/env";

export const pool = new Pool({
  port: env.PORT,
  connectionString: env.DATABASE_URL,
});
