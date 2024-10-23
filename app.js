require("dotenv/config"); // Load environment variables from .env file
const express = require("express"); // Import Express framework
const morgan = require("morgan"); // Import Morgan for logging HTTP requests
const cors = require("cors"); // Import CORS for handling Cross-Origin Resource Sharing
const helmet = require("helmet"); // Import Helmet for setting security-related HTTP headers
const compression = require("compression"); // Import Compression for compressing response bodies
const rateLimit = require("express-rate-limit"); // Import Rate Limiting middleware
const AppError = require("./utils/appError.js"); // Import custom AppError class

// Routers
const aiRouter = require("./routes/ai.routes.js"); // Import AI routes
const nvdRouter = require("./routes/cve-nvd.routes.js"); // Import NVD routes
const reportRouter = require("./routes/reports.routes.js"); // Import Report routes
const loginRouter = require('./routes/login.js')



const app = express(); // Create an Express application

app.use(cors()); // Enable CORS
app.options("*", cors()); // Enable CORS pre-flight for all routes

// Global Middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // Use Morgan for logging in development mode
}

// Set security HTTP headers
app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
          baseUri: ["'self'"],
          fontSrc: ["'self'", 'https:', 'http:', 'data:'],
          scriptSrc: ["'self'", 'https:', 'http:', 'blob:'],
          styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'http:'],
          imgSrc: ["'self'", 'data:', 'blob:'],
      },
  })
);

// Improve Request Performance
app.use(compression()); // Use Compression to compress response bodies

// Rate limiter
const limiter = rateLimit({
  max: 10000, // Maximum number of requests
  windowMs: 60 * 60 * 1000, // Time window in milliseconds (1 hour)
  handler: (req, res, next) => {
    next(
      new AppError(
        'Ha enviado demasiadas peticiones, por favor espere un tiempo antes de continuar.', // Error message in Spanish
        429 // HTTP status code for Too Many Requests
      )
    );
  },
});

app.use(limiter); // Apply rate limiting to all requests

// Routes
app.use(express.json()); // Parse incoming JSON requests
app.use("/ai", aiRouter); // Use AI routes
app.use("/nvd", nvdRouter); // Use NVD routes
//app.use("/reports", reportRouter); // Use Report routes
app.use('/login', loginRouter) //do Authentication and User Management


// Error handler for invalid routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)); // Handle invalid routes
});

// Healthcheck endpoint
app.get('/healthcheck', (req, res) => {
  res.send('Hello World!'); // Simple healthcheck endpoint
});

// Global error handling middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500; // Default status code to 500 if not set
  err.status = err.status || 'error'; // Default status to 'error' if not set

  res.status(err.statusCode).json({
    status: err.status, // Send error status
    message: err.message, // Send error message
  });
});

const PORT = process.env.PORT || 8000; // Set the port from environment variable or default to 8000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`); // Start the server and log the port
});
