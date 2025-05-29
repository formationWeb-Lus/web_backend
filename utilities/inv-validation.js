const { body } = require("express-validator")

const classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty().withMessage("Classification name is required.")
      .matches(/^[A-Za-z0-9\s\-']+$/).withMessage("Only letters, numbers, spaces, hyphens, and apostrophes are allowed."),
  ]
}

module.exports = { classificationRules }
