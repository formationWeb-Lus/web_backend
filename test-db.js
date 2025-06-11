require('dotenv').config();
const { Pool } = require('pg');
console.log(process.env.ACCESS_TOKEN_SECRET);

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

const Util = require("./utilities");

(async () => {
  const nav = await Util.getNav();
  console.log(nav);
})();


test();
