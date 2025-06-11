require('dotenv').config();
const jwt = require('jsonwebtoken');

function checkEmployeeOrAdmin(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    req.flash('notice', 'Please log in to access this page.');
    return res.redirect('/account/login');
  }
console.log('Secret used to verify token:', process.env.ACCESS_TOKEN_SECRET);

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.account = decoded;
    return next();
  } catch (err) {
    console.error('Invalid JWT Token:', err.message);
    res.clearCookie('jwt');
    req.flash('notice', 'Invalid token.');
    return res.redirect('/account/login');
  }
}

module.exports = { checkEmployeeOrAdmin };
