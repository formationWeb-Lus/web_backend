const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // utilise la variable d'env
  ssl: {
    require: true,            // force l'utilisation de SSL
    rejectUnauthorized: false // accepte les certificats auto-signés (Render)
  }
})

module.exports = pool


