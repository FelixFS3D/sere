/**
 * @file auth.validator.js
 * @description Zod Validation Schemas for Authentication endpoints.
 */

const { z } = require('zod');

// Signup validation schema
const signupSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[a-z]/, { message: 'Password must contain a lowercase letter' })
    .regex(/[A-Z]/, { message: 'Password must contain an uppercase letter' })
    .regex(/\d/, { message: 'Password must contain a number' }),
});

// Login validation schema
const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

module.exports = { signupSchema, loginSchema };
