const invModel = require("../models/inventoryModel");

async function buildClassificationView(req, res, next) {
  try {
    const classificationId = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classificationId);
    res.render("./inventory/classification", {
      title: "Vehicle Classification",
      inventory: data,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildClassificationView
};
