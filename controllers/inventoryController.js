const invModel = require("../models/inventoryModel")

async function buildClassificationView(req, res) {
  const classificationId = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classificationId)

  // On construit la grille HTML (tu peux améliorer le style plus tard)
  let grid = '<ul class="inventory-list">'
  data.rows.forEach(vehicle => {
    grid += `
      <li>
        <h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>
        <p><strong>Price:</strong> $${vehicle.inv_price}</p>
        <a href="/inv/detail/${vehicle.inv_id}">View Details</a>
      </li>
    `
  })
  grid += '</ul>'

  res.render("./inventory/classification", {
    title: "Vehicle Inventory",
    grid, // <-- ✅ Ici on passe 'grid' à la vue
  })
}

module.exports = {
  buildClassificationView,
}
