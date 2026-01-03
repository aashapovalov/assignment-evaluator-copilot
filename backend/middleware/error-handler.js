export function errorHandler (err, req, res, next) {
  console.error('Error:', err);

  // Multer errors
  if (err.name === 'MulterError') {
    return res.status(400).json({
      error: 'File upload error',
      details: err.message,
    });
  }

  // Axios errors (ML service)
  if (err.response) {
    return res.status(502).json({
      error: 'ML service error',
      details: err.response.data,
    });
  }

  // Default error
  res.status(500).json({
    error: err.message || 'Internal server error',
  });
}