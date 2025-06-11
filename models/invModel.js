// models/invModel.js
const pool = require("../database/connection");

/* ============================
 * Obtenir toutes les classifications
 * ============================ */
async function getClassifications() {
  try {
    const result = await pool.query("SELECT * FROM classification ORDER BY classification_name");
    return result.rows;
  } catch (err) {
    console.error("Error fetching classifications:", err);
    throw err;
  }
}

/* ============================
 * Obtenir les véhicules d'une classification
 * ============================ */
async function getInventoryByClassificationId(classification_id) {
  try {
    const sql = `
      SELECT i.*, c.classification_name 
      FROM inventory AS i
      JOIN classification AS c
        ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1
      ORDER BY i.make, i.model
    `;
    const data = await pool.query(sql, [classification_id]);
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error:", error);
    return [];
  }
}

async function getClassifications() {
  const result = await pool.query("SELECT * FROM classification ORDER BY classification_name");
  return result.rows;
}
/* ============================
 * Obtenir un véhicule par son ID
 * ============================ */
async function getInventoryById(inv_id) {
  try {
    const sql = "SELECT * FROM inventory WHERE inventory_id = $1";
    const result = await pool.query(sql, [inv_id]);
    return result.rows[0];
  } catch (error) {
    console.error("getInventoryById error:", error);
    return null;
  }
}

/* ============================
 * Ajouter une classification
 * ============================ */
async function addClassification(classification_name) {
  try {
    const sql = `
      INSERT INTO classification (classification_name)
      VALUES ($1)
      RETURNING *;
    `;
    const result = await pool.query(sql, [classification_name]);
    return result.rows[0];
  } catch (error) {
    console.error("addClassification error:", error);
    return null;
  }
}

/* ============================
 * Ajouter un véhicule
 * ============================ */
async function addInventory(data) {
  try {
    const sql = `
      INSERT INTO inventory (
        classification_id, make, model, description,
        inv_image, inv_thumbnail, price, year, miles, color
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *;
    `;
    const values = [
      data.classification_id,
      data.make,
      data.model,
      data.description,
      data.inv_image,
      data.inv_thumbnail,
      data.price,
      data.year,
      data.miles,
      data.color,
    ];
    const result = await pool.query(sql, values);
    return result.rows[0];
  } catch (error) {
    console.error("addInventory error:", error);
    return null;
  }
}

/* ============================
 * Mettre à jour un véhicule
 * ============================ */
async function updateVehicle(inv_id, data) {
  try {
    const sql = `
      UPDATE inventory
      SET classification_id = $1,
          make = $2,
          model = $3,
          description = $4,
          price = $5,
          year = $6,
          miles = $7,
          color = $8,
          inv_image = $9,
          inv_thumbnail = $10
      WHERE inventory_id = $11
      RETURNING *;
    `;
    const values = [
      data.classification_id,
      data.make,
      data.model,
      data.description,
      data.price,
      data.year,
      data.miles,
      data.color,
      data.inv_image,
      data.inv_thumbnail,
      inv_id
    ];
    const result = await pool.query(sql, values);
    return result.rows[0];
  } catch (error) {
    console.error("updateVehicle error:", error);
    return null;
  }
}
async function getNav() {
  try {
    const result = await pool.query("SELECT classification_name, classification_id FROM classification ORDER BY classification_name");
    return result.rows;
  } catch (error) {
    console.error("getNav error:", error);
    return [];
  }
}


async function updateClassification(id, name) {
  try {
    const sql = `UPDATE classification SET classification_name = $1 WHERE classification_id = $2`;
    await pool.query(sql, [name, id]);
  } catch (error) {
    console.error("updateClassification error:", error);
    throw error;
  }
}


module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  addClassification,
  addInventory,
  updateVehicle,
  getNav,  // ajouté ici
  updateClassification,
};
