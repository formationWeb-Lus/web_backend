const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ========== View Builders ========== */
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
      errors: null,
      messages: { notice: req.flash("notice") }
    });
  } catch (err) {
    next(err);
  }
}

async function buildAccountManagement(req, res) {
  const nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_type } = req.account;

  res.render("account/management", {
    title: "Account Management",
    nav,
    account_firstname,
    account_lastname,
    account_email,
    account_type,
  });
}

/* ========== Registration ========== */
async function registerAccount(req, res) {
  const { account_firstname, account_lastname, account_email, account_password } = req.body;
  const nav = await utilities.getNav();

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult && regResult.rows && regResult.rows.length > 0) {
      req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`);
      return res.redirect("/account/login");
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      return res.status(501).render("account/register", {
        title: "Register",
        nav,
        errors: null
      });
    }
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

/* ========== Login ========== */
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

    const passwordMatch = await bcrypt.compare(account_password, accountData.account_password);

    if (!passwordMatch) {
      req.flash("notice", "Incorrect password.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        messages: { notice: req.flash("notice") }
      });
    }
console.log('Secret used to sign token:', process.env.ACCESS_TOKEN_SECRET);

    // Générer un token JWT
    const token = jwt.sign(
      {
        account_id: accountData.account_id,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        account_type: accountData.account_type,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

  


    // Envoyer le token dans un cookie httpOnly
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000 // 1h
    });

    req.flash("success", "You are now logged in.");
    return res.redirect("/inv/management");

  } catch (error) {
    console.error("Login error:", error);
    req.flash("notice", "An error occurred during login.");
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      messages: { notice: req.flash("notice") }
    });
  }
}

/* ========== Logout ========== */
function logoutAccount(req, res) {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out.");
  res.redirect("/");
}

/* ========== Exports ========== */
module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  logoutAccount,
  buildAccountManagement,
};
