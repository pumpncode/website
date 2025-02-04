import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./database/schema.js";

const {
	env
} = Deno;

const databaseUrl = env.get("DATABASE_URL");

if (databaseUrl === undefined) {
	throw new Error("DATABASE_URL environment variable is required");
}

const neonDatabase = neon(databaseUrl);

const database = drizzle({
	casing: "snake_case",
	client: neonDatabase,
	schema: { ...schema }
});

export default database;
