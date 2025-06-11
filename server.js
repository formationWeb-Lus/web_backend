// server.js
require("dotenv").config();

const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const pgSession = require("connect-pg-simple")(session);
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");

const pool = require("./database");
const invModel = require("./models/invModel");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const baseController = require("./controllers/basecontroller");
const utilities = require("./utilities");

const app = express();

// 🔧 Middlewares parsing
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// 💾 Sessions PostgreSQL
app.use(
  session({
    store: new pgSession({ pool, createTableIfMissing: false }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    name: "sessionId",
  })
);

// 💬 Flash messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// 🔐 Middleware JWT unique
app.use(utilities.checkJWTToken);

// 📁 Fichiers statiques
app.use(express.static("public"));

// 🎨 EJS + Layouts
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// 🌐 Navigation dynamique
app.use(async (req, res, next) => {
  try {
    const nav = await invModel.getNav();
    res.locals.nav = nav;
    next();
  } catch (err) {
    console.error("Navigation error:", err);
    res.locals.nav = [];
    next();
  }
});

// 🛣️ Routes
app.use("/", inventoryRoute);
app.use("/inv", inventoryRoute);
app.use("/account", accountRoute);

// 🏠 Home route
app.get("/", baseController.buildHome);

// ❌ 404
app.use((req, res, next) => {
  res.status(404).render("errors/404", { title: "Page Not Found" });
});

// ❗ Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).render("errors/500", {
    title: "Server Error",
    message: err.message,
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// 🚀 Start
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`✅ App listening at http://${host}:${port}`);
});
