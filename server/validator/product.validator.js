const { z } = require('zod');

/**
 * Schema for creating a product.
 * Validates the request body when creating a new product.
 */
exports.createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().positive('Price must be positive'),
  stock: z.number().int().min(0, 'Stock must be zero or greater'),
  description: z.string().optional(),
  image: z.string().url('Image must be a valid URL').optional(),
  category: z.enum(['Electronics', 'Clothing', 'Home', 'Books', 'Other']).optional()
});

/**
 * Schema for updating a product.
 * Validates the request body when updating an existing product.
 * All fields are optional since it is an update operation.
 */
exports.updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().min(0).optional(),
  description: z.string().optional(),
  image: z.string().url().optional(),
  category: z.enum(['Electronics', 'Clothing', 'Home', 'Books', 'Other']).optional()
});
