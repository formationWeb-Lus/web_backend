const express = require("express")
const router = express.Router()
const invController = require("../controllers/inventoryController")

// Route de classification
router.get("/type/:classificationId", invController.buildClassificationView)

module.exports = router
