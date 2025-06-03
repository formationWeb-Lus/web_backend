const utilities = require("../utilities");
const invModel = require("../models/invModel");
const { validationResult } = require("express-validator");

// View: Inventory by classification
async function buildClassificationView(req, res, next) {
  try {
    const classificationId = req.params.classificationId;
    const nav = await utilities.getNav();
    const data = await invModel.getInventoryByClassificationId(classificationId);
    res.render("./inventory/classification", {
      title: "Vehicle Classification",
      nav,
      inventory: data,
    });
  } catch (error) {
    next(error);
  }
}

// View: Inventory management page
async function buildManagement(req, res) {
  const nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    message: req.flash("message"),
    errors: null,
  });
}

// View: Add Classification
async function buildAddClassification(req, res) {
  const nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    message: req.flash("message"),
    errors: null,
    classification_name: "", // Valeur vide par défaut
  });
}

// Process: Add Classification
async function addClassification(req, res) {
  const nav = await utilities.getNav();
  const { classification_name } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      message: null,
      errors: errors.array(),
      classification_name, // pré-remplir champ
    });
  }

  const result = await invModel.addClassification(classification_name);

  if (result) {
    req.flash("message", `Classification "${classification_name}" added successfully.`);
    return res.redirect("/inv");
  } else {
    const message = "Failed to add classification. Please try again.";
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      message,
      errors: null,
      classification_name, // pré-remplir champ même en cas d'erreur d'insertion
    });
  }
}

// View: Add Vehicle Form
async function buildAddInventory(req, res) {
  const nav = await utilities.getNav();
  const classifications = await invModel.getClassifications();

  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList: classifications,
    message: req.flash("message"),
    errors: null,
    inventory: {}, // vide par défaut
  });
}

// Process: Add Vehicle
async function addInventory(req, res) {
  const nav = await utilities.getNav();
  const classifications = await invModel.getClassifications();
  const errors = validationResult(req);

  const inventory = {
    classification_id: req.body.classification_id,
    make: req.body.make,
    model: req.body.model,
    description: req.body.description,
    inv_image: req.body.inv_image,
    inv_thumbnail: req.body.inv_thumbnail,
    price: req.body.price,
    year: req.body.year,
    miles: req.body.miles,
    color: req.body.color,
  };

  if (!errors.isEmpty()) {
    return res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList: classifications,
      message: null,
      errors: errors.array(),
      inventory, // pré-remplir tous les champs
    });
  }

  const result = await invModel.addInventory(inventory);

  if (result) {
    req.flash("message", "Vehicle added successfully.");
    return res.redirect("/inv");
  } else {
    const message = "Failed to add vehicle.";
    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList: classifications,
      message,
      errors: null,
      inventory, // réaffiche les champs même si erreur
    });
  }
}

module.exports = {
  buildClassificationView,
  buildManagement,
  buildAddClassification,
  addClassification,
  buildAddInventory,
  addInventory,
};
