// routes/invRoute.js
const express = require("express")
const router = express.Router()
const invController = require("../controllers/inventoryController")

// route pour voir les véhicules par type
router.get("/type/:classificationId", invController.buildClassificationView)

module.exports = router
