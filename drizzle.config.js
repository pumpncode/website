import { defineConfig } from "drizzle-kit";

const {
	env
} = Deno;

const databaseUrl = env.get("DATABASE_URL");

if (databaseUrl === undefined) {
	throw new Error("DATABASE_URL is required");
}

const config = defineConfig({
	dbCredentials: {
		url: databaseUrl
	},
	dialect: "postgresql",
	migrations: {
		schema: "public",
		table: "migrations"
	},
	out: "./database/migrations",
	schema: "./database/schema.js"
});

export default config;
