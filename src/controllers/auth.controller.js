const authService = require('../services/auth.service');
const ResponseFormatter = require('../utils/responseFormatter');

/**
 * Controladores de autenticación
 */

/**
 * POST /auth/login - Iniciar sesión
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Llamar al servicio de autenticación
    const result = await authService.login(email, password);

    // Responder con el token y datos del usuario
    res.status(200).json(
      ResponseFormatter.success(
        result,
        'Login successful',
        req.originalUrl
      )
    );
  } catch (error) {
    // Si es un error de credenciales inválidas, asegurar código 401
    if (error.status === 401 || error.message === 'Invalid credentials') {
      return res.status(401).json(
        ResponseFormatter.error(
          'INVALID_CREDENTIALS',
          'Invalid email or password',
          {},
          req.originalUrl
        )
      );
    }

    // Si es error de validación (falta email o password)
    if (error.status === 400) {
      return res.status(400).json(
        ResponseFormatter.error(
          'BAD_REQUEST',
          error.message,
          {},
          req.originalUrl
        )
      );
    }

    // Para otros errores, pasar al error handler
    next(error);
  }
};

module.exports = {
  login
};