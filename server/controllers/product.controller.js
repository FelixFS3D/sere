const Product = require('../models/Product.model');

/**
 * Create a new product
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.createProduct = async (req, res) => {
  const { name, description, price, image, category, stock } = req.body;
  try {
    const newProduct = await Product.create({
      name,
      description,
      price,
      image,
      category,
      stock
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
};

/**
 * Get all products
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

/**
 * Update a product
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { name, description, price, image, category, stock } = req.body;
  
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, description, price, image, category, stock },
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
};

/**
 * Delete a product
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.deleteProduct = async (req, res) => {
  const { productId } = req.params;
  
  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
};
