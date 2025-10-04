const config = require('../config/config');
const ResponseFormatter = require('../utils/responseFormatter');

/**
 * Middleware de autenticación con API Key
 * Valida que el header X-API-Key contenga una API Key válida
 */
const apiKeyAuth = (req, res, next) => {
  try {
    // Obtener API Key del header
    const apiKey = req.headers['x-api-key'];

    // Verificar si el API Key fue proporcionado
    if (!apiKey) {
      return res.status(401).json(
        ResponseFormatter.error(
          'API_KEY_MISSING',
          'API Key is required. Please provide X-API-Key header',
          {},
          req.originalUrl
        )
      );
    }

    // Verificar si el API Key es válido
    if (apiKey !== config.apiKey) {
      return res.status(401).json(
        ResponseFormatter.error(
          'INVALID_API_KEY',
          'Invalid API Key',
          {},
          req.originalUrl
        )
      );
    }

    // API Key válido, continuar
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = apiKeyAuth;