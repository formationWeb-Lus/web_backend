const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const { body } = require("express-validator");

// Validation rules
const vehicleValidationRules = [
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

// Inventory Management Home
router.get("/", invController.buildManagement);

// View by classification
router.get("/type/:classificationId", invController.buildClassificationView);

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
router.post("/add-inventory", vehicleValidationRules, invController.addInventory);

module.exports = router;
