const { z } = require("zod");

exports.createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be positive"),
  stock: z.number().int().min(0, "Stock must be zero or more"),
  description: z.string().optional(),
  image: z.string().url("Image must be a valid URL").optional(),
});

exports.updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().min(0).optional(),
  description: z.string().optional(),
  image: z.string().url().optional(),
});