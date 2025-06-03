const express = require("express");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const expressLayouts = require("express-ejs-layouts");
const pool = require("./database");
const invRoute = require("./routes/inventoryRoute");        // garder une seule déclaration ici
const accountRoute = require("./routes/accountRoute");
const baseController = require("./controllers/basecontroller");
const utilities = require("./utilities");

const app = express();

const getNav = require('./utilities/navigation');

// Middleware parsing (à mettre avant les routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static("public"));

// Middleware session - une seule déclaration
app.use(session({
  store: new pgSession({
    pool,
    createTableIfMissing: false,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  name: "sessionId"
}));

// Config EJS et layouts
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// Flash messages
app.use(require("connect-flash")());
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Middleware pour nav (avant les routes)
app.use(async (req, res, next) => {
  try {
    const nav = await utilities.getNav();
    res.locals.nav = nav;
    next();
  } catch (error) {
    next(error);
  }
});

// Routes
app.use("/inv", invRoute);
app.use("/account", accountRoute);
app.get("/", baseController.buildHome);

// 404 middleware
app.use((req, res, next) => {
  res.status(404).render("errors/404", { title: "Page Not Found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500);
  res.render("errors/500", {
    title: "Server Error",
    message: err.message,
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// Start server
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";
app.listen(port, () => {
  console.log(`App listening at http://${host}:${port}`);
});
