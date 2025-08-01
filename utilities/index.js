const jwt = require('jsonwebtoken');
const Util = {};

/* ************************
 * Build classification grid HTML
 ************************** */
Util.buildClassificationGrid = async function (data) {
  let grid = "";

  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach(vehicle => {
      grid += `<li>
        <a href="/inv/detail/${vehicle.inventory_id}" title="View ${vehicle.make} ${vehicle.model} details">
          <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.make} ${vehicle.model} on CSE Motors">
        </a>
        <div class="namePrice">
          <hr />
          <h2>
            <a href="/inv/detail/${vehicle.inventory_id}" title="View ${vehicle.make} ${vehicle.model} details">
              ${vehicle.make} ${vehicle.model}
            </a>
          </h2>
          <span>$${new Intl.NumberFormat('en-US').format(vehicle.price)}</span>
        </div>
      </li>`;
    });
    grid += "</ul>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }

  return grid;
};

/* ************************
 * Build navigation data for EJS
 * Returns an array of links for use in the navigation.ejs
 ************************** */
Util.getNav = async function () {
  const invModel = require("../models/invModel");
  const data = await invModel.getClassifications();

  const nav = [{ name: "Home", href: "/" }];

  if (data && data.rows) {
    data.rows.forEach(row => {
      nav.push({
        name: row.classification_name,
        href: `/inv/type/${row.classification_id}`,
      });
    });
  }

  return nav;
};

/* ************************
 * Build classification <select> list for forms
 ************************** */
Util.buildClassificationList = function (data, selected = null) {
  let list = '<select name="classification_id" id="classificationList" required>';
  list += '<option value="">Choose a classification</option>';

  if (data && data.rows) {
    data.rows.forEach(row => {
      list += `<option value="${row.classification_id}" ${
        selected == row.classification_id ? "selected" : ""
      }>${row.classification_name}</option>`;
    });
  }

  list += "</select>";
  return list;
};

/* ************************
 * Middleware wrapper for async error handling
 ************************** */
Util.handleErrors = function (fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/* ****************************************
 *  Check Login middleware
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* ****************************************
 *  JWT Token Check Middleware
 *  Vérifie le token JWT dans les cookies et valide
 * ************************************ */
Util.checkJWTToken = (req, res, next) => {
  const token = req.cookies.jwt; // ou où tu stockes le token

  if (!token) {
    res.locals.loggedin = false;
    return next();
  }

  try {
    const secret = process.env.JWT_SECRET || 'defaultSecret';
    const payload = jwt.verify(token, secret);
    res.locals.loggedin = true;
    res.locals.accountData = payload;
    next();
  } catch (error) {
    console.error("Invalid JWT Token:", error.message);
    res.locals.loggedin = false;
    next();
  }
};

module.exports = Util;
