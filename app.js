app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2 }, // 2h
  })
);

const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();

// sessions et flash
app.use(session({
  secret: "super_secret_key",
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

// rendre les messages flash accessibles dans les vues
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});
