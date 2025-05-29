require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // requis pour Render
  },
});

async function test() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('DB connection OK:', res.rows[0]);
  } catch (err) {
    console.error('DB connection FAILED:', err);
  } finally {
    await pool.end();
  }
}

test();
