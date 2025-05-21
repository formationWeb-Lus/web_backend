const inventoryModel = require("../models/inventoryModel")

async function buildClassificationView(req, res) {
  const classificationId = req.params.classificationId
  try {
    const data = await inventoryModel.getInventoryByClassificationId(classificationId)
    res.render("inventory/classification", {
  title: "Vehicles by Classification",
  items: data, // <-- maintenant le nom correspond à ta vue
})

    
  } catch (error) {
    console.error("Error building classification view:", error)
    res.status(500).send("Server Error")
  }
}

module.exports = {
  buildClassificationView,
}
