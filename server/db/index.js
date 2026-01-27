/**
 * @file index.js
 * @description Database connection configuration.
 * Establishes connection to MongoDB using Mongoose.
 */

const mongoose = require("mongoose");

// Sets the MongoDB URI for our app to have access to it.
// If no env has been set, we dynamically set it to whatever the folder name was upon the creation of the app
const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://localhost/sere-ecommerce-db";

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    // Security: Mask potentially sensitive info in logs if needed, 
    // but showing the DB name is generally helpful in dev.
    const dbName = x.connections[0].name;
    console.log(`🔌 Connected to Mongo! Database name: "${dbName}"`);
  })
  .catch((err) => {
    console.error("❌ Error connecting to mongo: ", err);
  });
