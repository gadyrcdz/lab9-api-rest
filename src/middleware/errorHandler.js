const ResponseFormatter = require('../utils/responseFormatter');

/**
 * Middleware central de manejo de errores
 * Captura todos los errores y devuelve respuestas consistentes
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Error de validación (422)
  if (err.name === 'ValidationError') {
    return res.status(422).json(
      ResponseFormatter.error(
        'VALIDATION_ERROR',
        'Validation failed',
        err.details || {},
        req.originalUrl
      )
    );
  }

  // Error de autenticación (401)
  if (err.name === 'UnauthorizedError' || err.message === 'Unauthorized') {
    return res.status(401).json(
      ResponseFormatter.error(
        'UNAUTHORIZED',
        'Authentication required',
        {},
        req.originalUrl
      )
    );
  }

  // Error de permisos (403)
  if (err.name === 'ForbiddenError' || err.message === 'Forbidden') {
    return res.status(403).json(
      ResponseFormatter.error(
        'FORBIDDEN',
        'Insufficient permissions',
        {},
        req.originalUrl
      )
    );
  }

  // Error de recurso no encontrado (404)
  if (err.name === 'NotFoundError' || err.message === 'Not Found') {
    return res.status(404).json(
      ResponseFormatter.error(
        'NOT_FOUND',
        'Resource not found',
        {},
        req.originalUrl
      )
    );
  }

  // Error de conflicto - SKU duplicado (409)
  if (err.name === 'ConflictError' || err.message.includes('already exists')) {
    return res.status(409).json(
      ResponseFormatter.error(
        'CONFLICT',
        err.message || 'Resource conflict',
        {},
        req.originalUrl
      )
    );
  }

  // Error JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json(
      ResponseFormatter.error(
        'INVALID_TOKEN',
        'Invalid token',
        {},
        req.originalUrl
      )
    );
  }

  // Error JWT expirado
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json(
      ResponseFormatter.error(
        'TOKEN_EXPIRED',
        'Token has expired',
        {},
        req.originalUrl
      )
    );
  }

  // Error genérico del servidor (500)
  res.status(err.status || 500).json(
    ResponseFormatter.error(
      'INTERNAL_SERVER_ERROR',
      err.message || 'Something went wrong',
      process.env.NODE_ENV === 'development' ? { stack: err.stack } : {},
      req.originalUrl
    )
  );
};

module.exports = errorHandler;