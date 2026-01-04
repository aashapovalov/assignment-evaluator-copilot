export const config = {
  port: process.env.PORT || 5051,
  mlServiceUrl: process.env.ML_SERVICE_URL || 'https://recorded-jackson-terms-mlb.trycloudflare.com',
  uploadDir: process.env.UPLOAD_DIR || 'uploads/',
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT) || 300000,
};