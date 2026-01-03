import express from 'express';
import cors from 'cors';

import { evaluationRouter, healthRouter } from "./routes/index.js";
import {errorHandler} from "./middleware/index.js";
import {config} from "./config/index.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/', healthRouter);
app.use('/', evaluationRouter);

// Error handler
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log('\n' + '='.repeat(60));
  console.log(`✓ Node.js backend running on http://localhost:${config.port}`);
  console.log(`✓ ML service: ${config.mlServiceUrl}`);
  console.log(`\nEndpoints:`);
  console.log(`  GET  /health`);
  console.log(`  POST /api/evaluate`);
  console.log('\n' + '='.repeat(60) + '\n');
});