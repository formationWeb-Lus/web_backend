const accountModel = require("../models/account-model");
const utilities = require("../utilities");

async function buildLogin(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
      notice: req.flash("notice") // ← récupère le message flash ici
    });
  } catch (err) {
    next(err);
  }
}

async function buildRegister(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null
    });
  } catch (err) {
    next(err);
  }
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  try {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    );

    // 👍 Si succès
    if (regResult && regResult.rows && regResult.rows.length > 0) {
      req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`);
      return res.redirect("/account/login"); // ← ici on fait un redirect, pas un render
    }

    // ❌ Sinon erreur
    req.flash("notice", "Sorry, the registration failed.");
    return res.status(501).render("account/register", {
      title: "Register",
      nav,
      errors: null
    });

  } catch (err) {
    console.error("Registration Error:", err);
    req.flash("notice", "An error occurred during registration.");
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null
    });
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount
};
