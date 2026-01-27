/**
 * @file validate.middleware.js
 * @description Generic validation middleware using Zod schemas.
 * Validates request body against provided schema.
 */

function validate(schema) {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      // Validation error handling
      // Zod errors usually contain details in error.errors
      const validationErrors = error.errors ? error.errors.map(e => e.message) : ['Invalid data'];
      
      res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors 
      });
    }
  };
}

module.exports = { validate };
