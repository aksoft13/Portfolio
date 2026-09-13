import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false },
  max: 5,
  connectionTimeoutMillis: 3000,
});

pool.on("error", () => {
  // suppress idle client errors
});

export const db = drizzle(pool, { schema });
