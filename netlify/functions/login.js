mport { Client } from "pg";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    const client = new Client({
      connectionString: process.env.DATABASE_URL, // store in Netlify env vars
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();

    // insert or check user login
    const res = await client.query(
      "INSERT INTO users(email, password) VALUES($1, crypt($2, gen_salt('bf'))) RETURNING id",
      [email, password]
    );

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, userId: res.rows[0].id }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Server Error" };
  }
}
