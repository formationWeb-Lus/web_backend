const express = require("express");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const pool = require("./database");
const invRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");

require("dotenv").config();

const baseController = require("./controllers/basecontroller");
const utilities = require("./utilities");

const app = express();

// Config EJS et layouts
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// Middleware session avec store Postgres
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      pool,
      createTableIfMissing: false,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
);

// Flash messages
app.use(require("connect-flash")());
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Injection navigation HTML
app.use(async (req, res, next) => {
  try {
    const nav = await utilities.getNav();
    res.locals.nav = nav;
    next();
  } catch (error) {
    next(error);
  }
});

// Fichiers statiques
app.use(express.static("public"));

// Middleware pour lire le corps des requêtes (formulaires, JSON)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/inv", invRoute);

app.use("/account", accountRoute);
app.get("/", baseController.buildHome);

// Démarrage serveur
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";
app.listen(port, () => {
  console.log(`App listening at http://${host}:${port}`);
});

// Middleware 404
app.use((req, res, next) => {
  res.status(404).render("errors/404", { title: "Page Not Found" });
});

// Middleware gestion erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500);
  res.render("errors/500", {
    title: "Server Error",
    message: err.message,
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});
