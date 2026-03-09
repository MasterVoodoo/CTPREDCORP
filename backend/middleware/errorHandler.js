const errorHandler = (err, req, res, next) => {
  console.error('🚨 Server Error:', err.stack);
  console.error('Request URL:', req.originalUrl);
  console.error('Origin:', req.headers.origin);
  console.error('Method:', req.method);

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS Error',
      message: 'Origin not allowed',
      origin: req.headers.origin,
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
  }

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'development' 
    ? err.message 
    : 'Internal server error';

  res.status(statusCode).json({
    error: 'Server error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

const notFoundHandler = (req, res) => {
  console.log(`⚠️ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      '/api/health',
      '/api/buildings',
      '/api/units',
      '/api/admin',
      '/api/email/send-appointment',
      '/api/admin/appointments',
    ],
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
