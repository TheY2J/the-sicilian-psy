import pkg from "pg";
import bcrypt from "bcrypt";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.NEON_DB_URL,
  ssl: { rejectUnauthorized: false }
});

export async function handler(event, context) {
  try {
    const { email, password } = JSON.parse(event.body);

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return {
        statusCode: 401,
        body: JSON.stringify({ success: false, message: "User not found" })
      };
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return {
        statusCode: 401,
        body: JSON.stringify({ success: false, message: "Invalid password" })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Login successful", userId: user.id })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
}

