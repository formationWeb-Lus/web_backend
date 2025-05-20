const pool = require("../database")

// Récupère toutes les classifications
async function getClassifications() {
  const data = await pool.query("SELECT * FROM classification ORDER BY classification_name")
  return data
}

// 🔧 Récupère tous les véhicules selon l'ID de classification
async function getInventoryByClassificationId(classification_id) {
  const data = await pool.query("SELECT * FROM inventory WHERE classification_id = $1", [classification_id])
  return data
}

// ✅ Export des fonctions
module.exports = {
  getClassifications,
  getInventoryByClassificationId
}
