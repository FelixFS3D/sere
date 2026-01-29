const { z } = require('zod');

// Schema for adding a product to the cart
exports.addToCartSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1')
});

// Schema for updating a product quantity in the cart
exports.updateCartItemSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1')
});

// Schema for removing a product from the cart
exports.removeFromCartSchema = z.object({
    productId: z.string().min(1, 'Product ID is required')
});
