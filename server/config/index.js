/**
 * @file index.js
 * @description Global middleware configuration.
 * Configures CORS, Logging, Security headers, Rate Limiting, and Swagger documentation.
 */

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet"); // For secure HTTP headers
const rateLimit = require("express-rate-limit"); // For rate limiting
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

// Swagger definition details
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Sere Ecommerce API", // Changed to reflect specific project nature
    version: "1.0.0",
    description: "RESTful API documentation for Sere Ecommerce backend",
  },
  servers: [
    {
      url: "http://localhost:5005",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

// Swagger options
const swaggerOptions = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Middleware configuration function
module.exports = (app) => {
  // In development environment the app logs
  app.use(morgan("dev"));

  // To have access to `body` property in the request
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Security headers
  app.use(helmet());

  // Rate limiting: prevent abuse
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
  });
  app.use(limiter);

  // Cross-Origin Resource Sharing
  app.use(cors());

  // Swagger UI setup
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
