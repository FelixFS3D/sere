/**
 * @file app.js
 * @description Main application file.
 * Configures middlewares, routes, and database connections.
 */

// ? Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv').config();

// ? Connects to the database
// Note: Database connection will be enabled in the next commit
// require('./db');

const express = require('express');
const session = require('express-session');
const passport = require('passport');

// ? Passport configuration
// Note: Passport config will be enabled in future commits
// require('./config/passport');

const app = express();

// ? This function is getting exported from the config folder.
// It runs most pieces of middleware
// Note: Middleware config will be enabled in the next commit
// require('./config')(app);

// ? Session configuration
app.use(session({
	secret: process.env.SESSION_SECRET, // Security: Only use env variable
	resave: false,
	saveUninitialized: false,
}));

// ? Passport initialization
app.use(passport.initialize());
app.use(passport.session());

//  Start handling routes here
// Note: Routes will be enabled in future commits
// const indexRoutes = require('./routes/index.routes');
// app.use('/api', indexRoutes);

// 404 handler (después de las rutas)
app.use((req, res, next) => {
	res.status(404).json({ message: 'Welcome to the API! Routes are coming soon.' });
});

// Error handler (al final)
// const errorHandler = require('./error-handling');
// app.use(errorHandler);

module.exports = app;
