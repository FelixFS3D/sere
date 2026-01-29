const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Product Schema
 * Defines the structure of the Product document in the Cloud database.
 */
const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Clothing', 'Home', 'Books', 'Other'],
    default: 'Other'
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
