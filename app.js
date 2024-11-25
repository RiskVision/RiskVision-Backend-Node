require("dotenv/config"); // Load environment variables from .env file
const express = require("express"); // Import Express framework
const morgan = require("morgan"); // Import Morgan for logging HTTP requests
const cors = require("cors"); // Import CORS for handling Cross-Origin Resource Sharing
const helmet = require("helmet"); // Import Helmet for setting security-related HTTP headers
const compression = require("compression"); // Import Compression for compressing response bodies
const rateLimit = require("express-rate-limit"); // Import Rate Limiting middleware
const AppError = require("./utils/appError.js"); // Import custom AppError class
const { sql, poolPromise } = require('./database/dbSQL.js');

// Routers
const aiRouter = require("./routes/ai.routes.js"); // Import AI routes
const nvdRouter = require("./routes/cve-nvd.routes.js"); // Import NVD routes
const reportRouter = require("./routes/reports.routes.js"); // Import Report routes
const loginRouter = require('./routes/login.js')
const assetRouter = require('./routes/asset.routes.js');
const blobStorageRouter = require('./routes/blobstorage.routes.js');
const blobStorageRouterEmpresa = require('./routes/blobstorageempresa.routes.js');
const blobStorageRouterReportes = require('./routes/blobstoragereportes.routes.js');

const { generateAIResponse } = require("./services/ai.service.js");

const app = express(); // Create an Express application

app.use(cors()); // Enable CORS
app.options("*", cors()); // Enable CORS pre-flight for all routes

// Global Middlewares
if (process.env.ENVIRONMENT === "development") {
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
        'Ha enviado demasiadas peticiones, por favor espere un tiempo antes de continuar.', 
        429 // HTTP status code for Too Many Requests
      )
    );
  },
});

app.use(limiter); // Apply rate limiting to all requests

// Routes
app.use(express.json()); // Parse incoming JSON requests
//app.use("/ai", aiRouter); // Use AI routes
app.use("/nvd", nvdRouter); // Use NVD routes
app.use("/reports", reportRouter); // Use Report routes
app.use('/login', loginRouter) //do Authentication and User Management
app.use('/api/assets', assetRouter); // Asset routes for CRUD operations
app.use("/storage", blobStorageRouter); // Use Blob Storage routes
app.use("/storageEmpresa", blobStorageRouterEmpresa); // Use Blob Storage routes
app.use("/reportes-pasados", blobStorageRouterReportes); // Use Blob Storage routes

// Ruta de inicio (raíz)
app.get('/', (req, res) => {
    res.send('Bienvenido a la API de RiskVision');
});

app.get('/api/ai', async (req, res) => {
  try {
    const test = "Hablame de la ISO27005 y la ISO27001, pensando en riesgos que puede tener una empresa de tecnología";
    const reponseAI = await generateAIResponse(test);
    console.log(reponseAI);
    res.json(reponseAI);

  }catch (err) {
    res.status(500).send(err.message);
  }
});

// Healthcheck endpoint
app.get('/healthcheck', (req, res) => {
    res.send('Hello World!')
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

// Error handler for invalid routes
app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)); // Handle invalid routes
  });

const PORT = process.env.PORT || 8000; // Set the port from environment variable or default to 8000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`); // Start the server and log the port
});
