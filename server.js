const session = require("express-session");
const pool = require('./database/'); // ou selon ton fichier de connexion DB

require('dotenv').config()

const express = require("express")
const expressLayouts = require("express-ejs-layouts")

const baseController = require("./controllers/basecontroller")
const utilities = require("./utilities")
const inventoryRoute = require("./routes/inventoryRoute")

const app = express()

/* ***********************
 * View Engine and Layouts
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")





/* ***********************
 * Middleware
 * ************************/
 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))



// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})


// Express Messages Middleware
app.use(require('connect-flash')());

app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});


/* ***********************
 * Middleware to inject nav
 *************************/
app.use(async (req, res, next) => {
  try {
    const nav = await utilities.getNav()
    res.locals.nav = nav
    next()
  } catch (error) {
    next(error)
  }
})

/* ***********************
 * Static Routes
 *************************/
app.use(express.static("public"))

/* ***********************
 * Routes
 *************************/
app.use("/inv", inventoryRoute)
app.get("/", baseController.buildHome)

/* ***********************
 * Local Server Info
 *************************/
const port = process.env.PORT || 3000
const host = process.env.HOST || "localhost"
app.listen(port, () => {
  console.log(`App listening at http://${host}:${port}`)
})


// Middleware 404 - route non trouvée
app.use((req, res, next) => {
  res.status(404).render('errors/404', { title: "Page Not Found" });
});

// Middleware gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500);
  res.render('errors/500', { 
    title: "Server Error",
    message: err.message,
    error: process.env.NODE_ENV === 'development' ? err : {} // afficher stack en dev seulement
  });
});
