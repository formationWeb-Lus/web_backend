const { Pool } = require("pg")
require("dotenv").config()

const isProduction = process.env.NODE_ENV === "production"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
})

// Ajoute les logs seulement en développement
if (!isProduction) {
  pool.on("connect", () => {
    console.log("Connected to the database")
  })
}

module.exports = pool
