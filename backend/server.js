import express from 'express';
import cors from 'cors';

import { evaluationRouter, healthRouter } from "./routes/index.js";
import {config} from "./config/index.js";
import {errorHandler} from "./middleware/index.js";

const app = express();

// Middleware
app.use(express.json());

// CORS with environment-based origins
app.use(cors({
  origin: config.allowedOrigins,
  credentials: true
}));

// Routes
app.use('/', healthRouter);
app.use('/', evaluationRouter);

// Error handler
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
  console.log(`📡 ML Service: ${config.mlServiceUrl}`);
  console.log(`🌐 Allowed origins: ${config.allowedOrigins.join(', ')}`);
});