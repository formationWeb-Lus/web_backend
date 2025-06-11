const jwt = require("jsonwebtoken");
require("dotenv").config();

function checkEmployeeOrAdmin(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    req.flash("notice", "Please log in to access this page.");
    return res.redirect("/account/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (decoded.account_type === "Employee" || decoded.account_type === "Admin") {
      req.account = decoded;
      return next();
    } else {
      req.flash("notice", "Access denied: insufficient permissions.");
      return res.redirect("/account/login");
    }
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    req.flash("notice", "Invalid or expired token.");
    return res.redirect("/account/login");
  }
}

module.exports = { checkEmployeeOrAdmin };
