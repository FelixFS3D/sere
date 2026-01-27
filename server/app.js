
require("dotenv").config();
require("./db");
const express = require("express");

const session = require('express-session');
const passport = require('passport');
require('./config/passport');

const app = express();

require("./config")(app);

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

const indexRoutes = require("./routes/index.routes");

app.use("/api", indexRoutes);

// 404 handler (después de las rutas)
app.use((req, res, next) => {
	res.status(404).json({ message: "This route does not exist" });
});

// Error handler (al final)
const errorHandler = require('./error-handling');
app.use(errorHandler);

module.exports = app;
