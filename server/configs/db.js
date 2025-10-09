import { neon } from "@neondatabase/serverless";

let sql;

try {
  // Initialize the SQL client
  sql = neon(process.env.DATABASE_URL);

  // Test the connection (optional, good for debugging)
  const response = await sql`SELECT version()`;
  const { version } = response[0];
  console.log("Connected to Neon DB. PostgreSQL version:", version);
} catch (error) {
  console.error("Database connection error:", error.message);
  // Optionally handle fallback or rethrow
  throw new Error("Failed to connect to database");
}

export default sql;
