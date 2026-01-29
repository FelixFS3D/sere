const Joi = require('joi');

// Para agregar un producto al carrito
exports.addToCartSchema = Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required()
});

// Para actualizar la cantidad de un producto en el carrito
exports.updateCartItemSchema = Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required()
});

// Para eliminar un producto del carrito
exports.removeFromCartSchema = Joi.object({
    productId: Joi.string().required()
});