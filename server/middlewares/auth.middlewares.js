/**
 * @file auth.middlewares.js
 * @description Authentication and Authorization middlewares.
 * Handles JWT validation and Role-based access control.
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware to validate JWT token
 * Verifies if the token exists, is valid, and has not expired.
 * format: Bearer <token>
 */
function tokenValidation(req, res, next) {
  try {
    if (!req.headers.authorization) {
      throw new Error('No authorization header');
    }

    const tokenArr = req.headers.authorization.split(' ');
    const token = tokenArr[1];

    if (!token) {
      throw new Error('No token provided');
    }

    // Verify token and decode payload
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);
    
    // Attach user info to request object
    req.payload = payload;

    next();
  } catch (error) {
    res.status(401).json({ errorMessage: 'Token does not exist or is invalid' });
  }
}

/**
 * Middleware to validate Admin role
 * IMPORTANT: Must be used AFTER tokenValidation
 */
function adminValidation(req, res, next) {
  if (req.payload && req.payload.role === 'admin') {
    next();
  } else {
    res.status(403).json({ errorMessage: 'You do not have admin permissions' });
  }
}

module.exports = { tokenValidation, adminValidation };
