import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../db/schema";
import { Router } from "express";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export async function testConnection() {
  console.log(
    "🔍 DATABASE_URL:",
    process.env.DATABASE_URL ? "OK" : "❌ MANQUANT !",
  );
  console.log("🔍 Full URL:", process.env.DATABASE_URL || "undefined");

  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL connecté");
    client.release();
  } catch (error) {
    console.error("❌ Erreur:", error);
    throw error;
  }
}

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export { router };
