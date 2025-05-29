// database/index.js

const { Pool } = require("pg");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // SSL forcé toujours (même en dev)
  max: 5,
  idleTimeoutMillis: 30000,
});
// Gestion des erreurs inattendues sur les clients idle
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test rapide de connexion au démarrage (optionnel mais recommandé)
(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Database connected:', res.rows[0].now);
  } catch (error) {
    console.error('Database connection error:', error);
  }
})();

module.exports = pool;
