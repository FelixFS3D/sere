const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { tokenValidation } = require('../middlewares/auth.middlewares');
const { validate } = require('../middlewares/validate.middleware');
const { addToCartSchema, updateCartItemSchema, removeFromCartSchema } = require('../validator/cart.validator');

// Cart routes

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get user cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User cart data
 *       401:
 *         description: Unauthorized
 */
router.get('/', tokenValidation, cartController.getCart);

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add item to cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddToCart'
 *     responses:
 *       200:
 *         description: Item added to cart
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/add', tokenValidation, validate(addToCartSchema), cartController.addToCart);

/**
 * @swagger
 * /cart/update:
 *   put:
 *     summary: Update cart item
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCartItem'
 *     responses:
 *       200:
 *         description: Cart item updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.put('/update', tokenValidation, validate(updateCartItemSchema), cartController.updateCartItem);

/**
 * @swagger
 * /cart/remove:
 *   delete:
 *     summary: Remove item from cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RemoveFromCart'
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.delete('/remove', tokenValidation, validate(removeFromCartSchema), cartController.removeFromCart);

/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Clear user cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 *       401:
 *         description: Unauthorized
 */
router.delete('/clear', tokenValidation, cartController.clearCart);

/**
 * @swagger
 * /cart/checkout:
 *   post:
 *     summary: Checkout cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Checkout successful
 *       401:
 *         description: Unauthorized
 */
router.post('/checkout', tokenValidation, cartController.checkoutCart);

module.exports = router;
