const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");

async function buildLogin(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
      messages: { notice: req.flash("notice") }
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

    if (regResult && regResult.rows && regResult.rows.length > 0) {
      req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`);
      return res.redirect("/account/login");
    }

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

async function accountLogin(req, res) {
  const { account_email, account_password } = req.body;
  const nav = await utilities.getNav();

  try {
    const accountData = await accountModel.getAccountByEmail(account_email);

    if (!accountData) {
      req.flash("notice", "Email not found.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        messages: { notice: req.flash("notice") }
      });
    }

    const match = await bcrypt.compare(account_password, accountData.account_password);

    if (!match) {
      req.flash("notice", "Incorrect password.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        messages: { notice: req.flash("notice") }
      });
    }

    req.session.account = accountData;
    req.flash("notice", "You're now logged in.");
    return res.redirect("/inv");

  } catch (error) {
    console.error("Login error:", error);
    req.flash("notice", "Login failed. Please try again.");
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      messages: { notice: req.flash("notice") }
    });
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin
};
