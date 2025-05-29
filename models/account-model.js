const pool = require("../database/");

/* ========== Inscription d'un nouveau compte ========== */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = `
      INSERT INTO account (
        account_firstname,
        account_lastname,
        account_email,
        account_password,
        account_type
      )
      VALUES ($1, $2, $3, $4, 'Client')
      RETURNING *;
    `;
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password
    ]);
  } catch (error) {
    console.error("Registration Error:", error.message);
    return null;
  }
}

module.exports = { registerAccount };
