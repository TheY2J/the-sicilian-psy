import pkg from "pg";
import bcrypt from "bcrypt";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.NEON_DB_URL, // stored in Netlify env vars
  ssl: { rejectUnauthorized: false }
});

export async function handler(event, context) {
  try {
    const { email, password } = JSON.parse(event.body);

    const hashed = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, hashed]);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "User registered!" })
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
}
