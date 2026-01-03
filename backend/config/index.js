export const config = {
  port: process.env.PORT || 5051,
  mlServiceUrl: process.env.ML_SERVICE_URL || 'https://patents-griffin-upper-rising.trycloudflare.com',
  uploadDir: process.env.UPLOAD_DIR || 'uploads/',
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT) || 30000,
};