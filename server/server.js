/**
 * @file server.js
 * @description Entry point for the Express server.
 * Initializes the application and starts listening on the specified port.
 * @author Felix
 */

const app = require("./app");

// ℹ️ Sets the port the server handles requests on.
// If process.env.PORT is not found, it falls back to 5005
const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
