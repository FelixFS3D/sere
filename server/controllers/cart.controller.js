const Cart = require('../models/Cart.model');
const Product = require('../models/Product.model');
// Only require Order model when actually used to prevent circular dependencies or errors if not exists yet
// const Order = require('../models/Order.model'); 

/**
 * Get all items in the cart
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getCart = async (req, res) => {
    try {
        const userId = req.user._id;
        let cart = await Cart.findOne({ user: userId, status: 'active' }).populate('items.product');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Add item to cart
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({ message: 'Product ID and quantity are required' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ user: userId, status: 'active' });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Update item quantity in cart
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.updateCartItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        if (!productId || quantity === undefined) {
            return res.status(400).json({ message: 'Product ID and quantity are required' });
        }

        const cart = await Cart.findOne({ user: userId, status: 'active' }); // Added status active check
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        if (quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Remove item from cart
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const cart = await Cart.findOne({ user: userId, status: 'active' });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Clear the cart
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.clearCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId, status: 'active' });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Checkout the cart
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.checkoutCart = async (req, res) => {
    // Note: This function requires the Order model which is in the next commit.
    // For now, it returns a 501 Not Implemented or works partially.
    // Uncomment the Order logic when Order model is available.
    
    // const Order = require('../models/Oder.model'); // Pending implementation

    try {
        /*
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId, status: 'active' }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }
        
        // Logic will be enabled when Order model exists
        // ...
        
        // This is a temporary response to prevent crashes
        */
        res.status(501).json({ message: 'Checkout functionality will be available in the next update (Order System).' });
        
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
