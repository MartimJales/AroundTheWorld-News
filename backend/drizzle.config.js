/** @type { import("drizzle-kit").Config } */
export default {
	dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
	schema: "./src/db/schema.mjs",
	out: "./drizzle",
	dbCredentials: {
		user: "postgres",
		postgres: "postgres",
		password: "chentech",
		host: "localhost"
	},
};
