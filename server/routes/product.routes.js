const express = require('express');
const router = express.Router();
const { tokenValidation, adminValidation } = require('../middlewares/auth.middlewares');
const productController = require('../controllers/product.controller');
const { validate } = require('../middlewares/validate.middleware');
const { createProductSchema, updateProductSchema } = require('../validator/product.validator');

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management endpoints
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product (Admin only)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProduct'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post('/', tokenValidation, adminValidation, validate(createProductSchema), productController.createProduct);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: List of all products
 */
router.get('/', productController.getAllProducts);

/**
 * @swagger
 * /products/{productId}:
 *   put:
 *     summary: Update a product (Admin only)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProduct'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Product not found
 */
router.put('/:productId', tokenValidation, adminValidation, validate(updateProductSchema), productController.updateProduct);

/**
 * @swagger
 * /products/{productId}:
 *   delete:
 *     summary: Delete a product (Admin only)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Product not found
 */
router.delete('/:productId', tokenValidation, adminValidation, productController.deleteProduct);

module.exports = router;
