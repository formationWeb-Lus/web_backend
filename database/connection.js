// database/connection.js
const { Pool } = require('pg')

// Assure-toi que DATABASE_URL est bien définie dans Render et en local via un .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

module.exports = pool
