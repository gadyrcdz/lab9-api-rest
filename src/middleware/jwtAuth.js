const jwt = require('jsonwebtoken');
const config = require('../config/config');
const ResponseFormatter = require('../utils/responseFormatter');

/**
 * Middleware de autenticación con JWT
 * Valida el token JWT del header Authorization
 */
const jwtAuth = (req, res, next) => {
  try {
    // Obtener el header de autorización
    const authHeader = req.headers['authorization'];

    // Verificar si el header existe
    if (!authHeader) {
      return res.status(401).json(
        ResponseFormatter.error(
          'TOKEN_MISSING',
          'Authorization token is required',
          {},
          req.originalUrl
        )
      );
    }

    // El formato debe ser: "Bearer <token>"
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json(
        ResponseFormatter.error(
          'INVALID_TOKEN_FORMAT',
          'Token format must be: Bearer <token>',
          {},
          req.originalUrl
        )
      );
    }

    const token = parts[1];

    // Verificar y decodificar el token
    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
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

        return res.status(401).json(
          ResponseFormatter.error(
            'INVALID_TOKEN',
            'Invalid token',
            {},
            req.originalUrl
          )
        );
      }

      // Adjuntar la información del usuario al request
      req.user = decoded;
      next();
    });
  } catch (error) {
    next(error);
  }
};

module.exports = jwtAuth;