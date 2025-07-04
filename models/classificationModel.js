const pool = require("../database/connection");

// Récupérer toutes les classifications
async function getClassifications() {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM public.classification ORDER BY classification_name");
    return result.rows;
  } catch (error) {
    console.error("getClassifications error:", error);
    return [];
  } finally {
    client.release();
  }
}

// Récupérer les véhicules par classification
async function getInventoryByClassificationId(classification_id) {
  const client = await pool.connect();
  try {
    const sql = `
      SELECT i.*, c.classification_name 
      FROM public.inventory AS i
      JOIN public.classification AS c
        ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1
      ORDER BY i.make, i.model
    `;
    const result = await client.query(sql, [classification_id]);
    return result.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error:", error);
    return [];
  } finally {
    client.release();
  }
}

// Ajouter une classification
async function addClassification(classification_name) {
  const client = await pool.connect();
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *";
    const result = await client.query(sql, [classification_name]);
    return result.rows[0];
  } catch (error) {
    console.error("addClassification error:", error);
    return null;
  } finally {
    client.release();
  }
}

// Ajouter un véhicule
async function addInventory(data) {
  const client = await pool.connect();
  try {
    const sql = `
      INSERT INTO public.inventory (
        classification_id,
        make,
        model,
        description,
        inv_image,
        inv_thumbnail,
        price,
        year,
        miles,
        color
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
    const result = await client.query(sql, values);
    return result.rows[0];
  } catch (error) {
    console.error("addInventory error:", error);
    return null;
  } finally {
    client.release();
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  addClassification,
  addInventory,
};
