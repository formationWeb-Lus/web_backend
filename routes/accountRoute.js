const express = require('express');
const router = express.Router();

const utilities = require('../utilities');
const accountController = require('../controllers/accountController');
const regvalidate = require("../utilities/account-validation");
const { checkEmployeeOrAdmin } = require("../middleware/checkAuth");

// 🔐 Route protégée par JWT : accès réservé aux employés/admins
router.get("/manage", checkEmployeeOrAdmin, accountController.buildAccountManagement);

// Affiche le formulaire de login
router.get('/login', utilities.handleErrors(accountController.buildLogin));

// Affiche le formulaire d'inscription
router.get('/register', utilities.handleErrors(accountController.buildRegister));

// Déconnecte l'utilisateur (supprime le cookie JWT)
router.get('/logout', utilities.handleErrors(accountController.logoutAccount));

// Enregistre un nouvel utilisateur après validation
router.post(
  "/register",
  regvalidate.registrationRules(),
  regvalidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Connecte l'utilisateur après validation
router.post(
  "/login",
  regvalidate.loginRules(),
  regvalidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Redirige vers /login si /account est accédé sans route spécifique
router.get('/', (req, res) => {
  res.redirect('/account/login');
});

module.exports = router;
