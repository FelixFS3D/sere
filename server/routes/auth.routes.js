const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { tokenValidation } = require("../middlewares/auth.middlewares");
const { validate } = require("../middlewares/validate.middleware");
const { signupSchema, loginSchema } = require("../validator/auth.validator");

// ========================
// Traditional Authentication
// ========================

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123!
 *     responses:
 *       201:
 *         description: User registered successfully. Verification email sent.
 *       400:
 *         description: User already exists or validation error
 */
router.post("/signup", validate(signupSchema), authController.signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login with email and password
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123!
 *     responses:
 *       200:
 *         description: Successful login with JWT token
 *       400:
 *         description: Invalid credentials
 *       403:
 *         description: Email not verified
 */
router.post("/login", validate(loginSchema), authController.login);

/**
 * @swagger
 * /auth/verify:
 *   get:
 *     summary: Verify JWT token
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Unauthorized - Invalid or expired token
 */
router.get("/verify", tokenValidation, authController.verify);

module.exports = router;
