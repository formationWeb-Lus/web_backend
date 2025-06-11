const invModel = require("../models/invModel");
const utilities = require("../utilities/");
const { validationResult } = require("express-validator");
const pool = require('../database'); // ou selon ton setup

const invController = {};

const buildAddVehicle = async (req, res) => {
  try {
    const classifications = await invModel.getClassifications(); // ou ton modèle correct
    res.render("inventory/vehicle-added", {
      title: "Add Vehicle",
      classifications,
      message: null
    });
  } catch (error) {
    console.error("Error in buildAddVehicle:", error);
    res.status(500).render("inventory/vehicle-added", {
      title: "Add Vehicle",
      classifications: [],
      message: "Error loading form."
    });
  }
};


async function updateClassification(req, res) {
  const id = req.params.id;
  const { classification_name } = req.body;

  try {
    await invModel.updateClassification(id, classification_name);
    res.redirect("/inv/manage"); // ou une autre page de redirection
  } catch (err) {
    console.error("Update classification error:", err);
    res.status(500).render("errors/500", { title: "Server Error", message: err.message });
  }
}


/* ============================
 * Page principale de gestion
 * ============================ */
invController.buildManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
      message: req.flash("message"),
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

/* ============================
 * Formulaire ajout classification
 * ============================ */
invController.buildAddClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      message: req.flash("message"),
      errors: null,
      classification_name: "",
    });
  } catch (error) {
    next(error);
  }
};

/* ============================
 * Traitement ajout classification
 * ============================ */
invController.addClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const { classification_name } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        message: null,
        errors: errors.array(),
        classification_name,
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
        classification_name,
      });
    }
  } catch (error) {
    next(error);
  }
};

/* ============================
 * Formulaire ajout véhicule
 * ============================ */
invController.buildAddInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classifications = await invModel.getClassifications();

    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList: classifications,
      message: req.flash("message"),
      errors: null,
      inventory: {},
    });
  } catch (error) {
    next(error);
  }
};

/* ============================
 * Traitement ajout véhicule
 * ============================ */
invController.addInventory = async function (req, res, next) {
  try {
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
        inventory,
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
        inventory,
      });
    }
  } catch (error) {
    next(error);
  }
};


async function buildAddInventory(req, res, next) {
  try {
    const classificationList = await invModel.getClassifications(); // récupère les classifications
    res.render("inv/add-inventory", {
      title: "Add New Vehicle",
      classificationList,  // passe la liste à la vue
      inventory: null,
      errors: null,
      message: null // ou "" selon ton choix
    });
  } catch (error) {
    next(error);
  }
}


async function getInventoryJSON(req, res) {
  const classification_id = req.params.classification_id;
  try {
    const data = await invModel.getInventoryByClassificationId(classification_id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching inventory" });
  }
}

async function addClassification(req, res) {
  // logique d'ajout ici
}


async function buildAddClassification(req, res) {
  res.render("inventory/add-classification", {
    title: "Add Classification",
    message: null,
  });
}


async function buildClassificationView(req, res, next) {
  const classificationId = req.params.classificationId;
  try {
    const data = await invModel.getInventoryByClassificationId(classificationId);
    if (data.length > 0) {
      const classificationName = data[0].classification_name;
      res.render("./inventory/classification", {
        title: classificationName + " vehicles",
        data,
      });
    } else {
      res.render("./inventory/classification", {
        title: "No vehicles found",
        data: [],
      });
    }
  } catch (error) {
    next(error);
  }
}

const buildManagement = async (req, res) => {
  res.render("inventory/vehicle-added", {
    title: "Inventory Management",
    message: "Vehicle added successfully.",
  });
};

async function buildByClassification(req, res, next) {
  const classification_id = req.query.classification_id
  const data = await invModel.getInventoryByClassificationId(classification_id)

  res.render("./inventory/classification-view", {
    title: "Vehicles by Classification",
    inventory: data
  })
}

/* ============================
 * Vue d'une classification
 * ============================ */
invController.buildClassificationView = async function (req, res, next) {
  const classification_id = parseInt(req.params.classificationId);
  try {
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const classificationName = await invModel.getClassificationNameById(classification_id);
    const nav = await utilities.getNav();

    if (data.length === 0) {
      return res.render("inventory/classification", {
        title: "No Vehicles Found",
        nav,
        message: "No vehicles found for this classification.",
        classificationName: "",
        inventoryList: null,
      });
    }

    const inventoryList = await utilities.buildInventoryList(data);

    res.render("inventory/classification", {
      title: `${classificationName} Vehicles`,
      nav,
      message: null,
      classificationName,
      inventoryList,
    });
  } catch (error) {
    next(error);
  }
};


// Exemple avec PostgreSQL ou autre


async function getInventory(req, res) {
  try {
    const result = await pool.query('SELECT * FROM inventory');
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching inventory:", err);
    res.status(500).json({ message: "Failed to fetch inventory" });
  }
}

module.exports = { getInventory };


async function addInventory(req, res) {
  try {
    // Supposons que tu récupères les classifications depuis le modèle
    const classifications = await invModel.getClassifications();

    // Logique pour ajouter le véhicule ici (exemple)
    // await invModel.addVehicle(req.body);

    // Afficher la page de confirmation avec message et menu
    res.render("inventory/vehicle-added", {
      title: "Inventory Management",
      message: "Vehicle added successfully.",
      classifications,
      nav: await utilities.getNav()
    });
  } catch (error) {
    console.error("Error adding vehicle:", error);
    // Pour éviter l’erreur dans add-inventory.ejs, on passe toutes les variables nécessaires
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      message: null,               // message doit être défini (null si pas de message)
      errors: null,                // pour afficher d’éventuelles erreurs de validation
      inventory: req.body || {},   // pour pré-remplir le formulaire avec les données soumises
      classificationList: await invModel.getClassifications(), // la liste des classifications
      error: "Error adding vehicle.", 
      nav: await utilities.getNav()
    });
  }
}

/* ============================
 * Formulaire d'édition véhicule
 * ============================ */
invController.editInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id);
    const nav = await utilities.getNav();
    const itemData = await invModel.getInventoryById(inv_id);
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id);
    const itemName = `${itemData.make} ${itemData.model}`;

    res.render("inventory/edit-inventory", {
      title: `Edit ${itemName}`,
      nav,
      classificationSelect,
      errors: null,
      inv_id: itemData.inventory_id,
      inv_make: itemData.make,
      inv_model: itemData.model,
      inv_year: itemData.year,
      inv_description: itemData.description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.price,
      inv_miles: itemData.miles,
      inv_color: itemData.color,
      classification_id: itemData.classification_id,
    });
  } catch (error) {
    next(error);
  }
};

/* ============================
 * Traitement de mise à jour véhicule
 * ============================ */
async function updateVehicle(req, res) {
  const vehicleId = req.body.vehicleId;
  const updatedData = {
    classification_id: req.body.classification,
    make: req.body.make,
    model: req.body.model,
    description: req.body.description,
    price: req.body.price,
    year: req.body.year,
    miles: req.body.miles,
    color: req.body.color,
    image: req.body.image,
    thumbnail: req.body.thumbnail
  };

  try {
    await invModel.updateVehicle(vehicleId, updatedData);
    res.redirect("/inv");
  } catch (err) {
    console.error(err);
    res.status(500).render("errors/500");
  }
}

invController.updateVehicle = updateVehicle;

exports.getInventoryByClassification = async (req, res) => {
  const classificationId = req.params.classificationId;

  try {
    const data = await pool.query(
      "SELECT * FROM inventory WHERE classification_id = $1",
      [classificationId]
    );
    res.json(data.rows); // <-- C'est ce que ton fetch() attend
  } catch (error) {
    console.error("Erreur dans getInventoryByClassification:", error);
    res.status(500).json({ error: "Erreur du serveur" });
  }
};


async function getInventoryJSON(req, res) {
  const classification_id = req.params.classification_id;
  try {
    const data = await invModel.getInventoryByClassificationId(classification_id);
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error retrieving inventory data");
  }
}




/* ============================
 * JSON pour véhicules d'une classification
 * ============================ */
invController.getInventoryJSON = async function (req, res, next) {
  try {
    const classification_id = parseInt(req.params.classification_id);
    const invData = await invModel.getInventoryByClassificationId(classification_id);
    res.json(invData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  invController,
   addInventory,
   buildByClassification,
   buildManagement,
   buildClassificationView,
   getInventory,
    buildAddClassification,
    addClassification,
     buildAddInventory,
     getInventoryJSON,
       buildAddVehicle,
};
