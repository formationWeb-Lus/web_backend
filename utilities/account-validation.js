const utilities = require(".");
const { body, validationResult } = require("express-validator");

const validate = {};

// Règles pour l'inscription
validate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty().withMessage("First name is required.")
      .isAlpha().withMessage("First name must contain only letters."),

    body("account_lastname")
      .trim()
      .notEmpty().withMessage("Last name is required.")
      .isAlpha().withMessage("Last name must contain only letters."),

    body("account_email")
      .trim()
      .notEmpty().withMessage("Email is required.")
      .isEmail().withMessage("Invalid email format.")
      .normalizeEmail(),

    body("account_password")
      .trim()
      .notEmpty().withMessage("Password is required.")
      .isLength({ min: 12 }).withMessage("Password must be at least 12 characters.")
      .matches(/[0-9]/).withMessage("Password must contain at least one number.")
      .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter.")
      .matches(/[^A-Za-z0-9]/).withMessage("Password must contain at least one special character.")
  ];
};

// Contrôle des données lors de l'inscription
validate.checkRegData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      errors: errors.array(), // ← pour EJS
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email,
    });
    return;
  }
  next();
};

// Règles pour la connexion (login)
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .notEmpty().withMessage("Email is required.")
      .isEmail().withMessage("Invalid email format.")
      .normalizeEmail(),

    body("account_password")
      .trim()
      .notEmpty().withMessage("Password is required.")
  ];
};

// Contrôle des données lors de la connexion
validate.checkLoginData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      errors: errors.array(),
      account_email: req.body.account_email,
    });
    return;
  }
  next();
};

module.exports = validate;
