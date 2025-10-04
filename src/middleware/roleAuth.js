const ResponseFormatter = require('../utils/responseFormatter');

/**
 * Middleware de autorización basada en roles
 * @param {Array} allowedRoles - Array de roles permitidos ['admin', 'editor']
 */
const roleAuth = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Verificar que el usuario esté autenticado (debe pasar por jwtAuth primero)
      if (!req.user) {
        return res.status(401).json(
          ResponseFormatter.error(
            'UNAUTHORIZED',
            'Authentication required',
            {},
            req.originalUrl
          )
        );
      }

      // Verificar que el usuario tenga uno de los roles permitidos
      const userRole = req.user.role;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json(
          ResponseFormatter.error(
            'FORBIDDEN',
            'Insufficient permissions. Required roles: ' + allowedRoles.join(', '),
            {
              userRole: userRole,
              requiredRoles: allowedRoles
            },
            req.originalUrl
          )
        );
      }

      // Usuario autorizado, continuar
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = roleAuth;