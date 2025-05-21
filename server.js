const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
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
