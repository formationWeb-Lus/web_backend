// database/connection.js

const { Pool } = require('pg')

const pool = new Pool({
  connectionString: 'postgresql://cse340:6wocQ5aarZpI6u4OHi3cbCcbDQHeOUJI@dpg-d0iad824d50c73b91asg-a.frankfurt-postgres.render.com/cse340_g56i',
  ssl: {
    rejectUnauthorized: false
  }
})

module.exports = pool
