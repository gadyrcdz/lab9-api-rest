// Temporal - Estudiante 2 implementará esto
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message || 'Something went wrong',
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    }
  });
};

module.exports = errorHandler;