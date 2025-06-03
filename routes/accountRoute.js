const express = require('express') 
const router = express.Router()
const utilities = require('../utilities')
const accountController = require('../controllers/accountController')
const validate = require("../utilities/account-validation")

// Route vers la page de login
router.get('/login', utilities.handleErrors(accountController.buildLogin))

// Route vers la page d'inscription
router.get('/register', utilities.handleErrors(accountController.buildRegister))

// Traitement de l'inscription avec validation
router.post(
  "/register",
  validate.registrationRules(),
  validate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Traitement de la connexion
router.post(
  "/login",
  validate.loginRules(),     // facultatif mais recommandé
  validate.checkLoginData,   // facultatif
  utilities.handleErrors(accountController.accountLogin)
)

// Redirection vers /login si /account est accédé directement
router.get('/', (req, res) => {
  res.redirect('/account/login')
})

module.exports = router
