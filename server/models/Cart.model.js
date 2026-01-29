const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Cart Schema
 * Represents a user's shopping cart.
 */
const cartSchema = new Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  items: [
    {
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
      },
      quantity: { 
        type: Number, 
        required: true, 
        min: 1 
      },
    }
  ],
  status: {
    type: String,
    enum: ['active', 'checked_out', 'abandoned'],
    default: 'active',
  }
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
