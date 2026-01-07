import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  port: process.env.PORT || 5051,
  mlServiceUrl: process.env.ML_SERVICE_URL || 'https://welding-consumer-infectious-preston.trycloudflare.com',
  uploadDir: process.env.UPLOAD_DIR || 'uploads/',
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT) || 300000,
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:5173',
    'http://localhost:3000'
  ],
};