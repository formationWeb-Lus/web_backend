const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
router.post("/inventory/type/:id");
const { body } = require("express-validator");
const utilities = require('../utilities');
 const db = require('../database/connection'); 
 const { checkEmployeeOrAdmin } = require("../middleware/checkAuth")

 // 👈 ICI
 // ← Exemple d'utilisation, si `getDb()` existe




// Validation rules
const inventoryValidationRules = [
  body("classification_id").notEmpty().withMessage("Classification is required"),
  body("make").trim().notEmpty().withMessage("Make is required"),
  body("model").trim().notEmpty().withMessage("Model is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("inv_image").trim().notEmpty().withMessage("Image path is required"),
  body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("year").isInt({ min: 1900, max: 2100 }).withMessage("Year must be valid"),
  body("miles").isInt({ min: 0 }).withMessage("Miles must be positive"),
  body("color").trim().notEmpty().withMessage("Color is required"),

];

router.get("/inventory", checkEmployeeOrAdmin);
router.get('/inventory', invController.getInventory);
// Inventory Management Home
router.get("/", invController.buildManagement);
// Exemple de route avec validation

router.get("/by-classification", invController.buildByClassification)
router.get("/add", invController.buildAddVehicle);


// View by classification
router.get("/type/:classificationId", invController.buildClassificationView);
router.get("/getInventory/:classification_id", invController.getInventoryJSON);
// Route to edit inventory item
router.get("/edit/:inventory_id" 
 );


 router.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const result = await db.query('DELETE FROM inventory WHERE inventory_id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/add', async (req, res) => {
  const id = req.query.id;  // récupère id depuis l’URL
  let vehicle = null;
  if (id) {
    const result = await db.query('SELECT * FROM inventory WHERE inventory_id = $1', [id]);
    vehicle = result.rows[0];
  }
  res.render('addVehicle', { vehicle });  // rendre la page addVehicle.ejs en envoyant les données
});

router.get("/add", invController.buildManagement);
 
router.get('/inventory-by-classification/:classificationId', async (req, res) => {
  const classificationId = req.params.classificationId;
  try {
    const result = await db.query(
      'SELECT * FROM inventory WHERE classification_id = $1',
      [classificationId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Add classification
router.get("/add-classification", invController.buildAddClassification);
router.post(
  "/add-classification",
  body("classification_name")
    .trim()
    .notEmpty().withMessage("Classification name is required")
    .matches(/^[A-Za-z0-9]+$/).withMessage("No spaces or special characters allowed"),
  invController.addClassification
);

// Add vehicle
router.get("/add-inventory", invController.buildAddInventory);
router.post("/add-inventory", inventoryValidationRules, invController.addInventory);


module.exports = router;