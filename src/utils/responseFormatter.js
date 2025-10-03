/**
 * Clase para formatear respuestas de la API de manera consistente
 */
class ResponseFormatter {
  /**
   * Formatea una respuesta exitosa
   * @param {*} data - Datos a retornar
   * @param {string} message - Mensaje descriptivo
   * @param {string} path - Path de la petición
   * @returns {Object} Respuesta formateada
   */
  static success(data, message = 'Success', path = '') {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
      path
    };
  }

  /**
   * Formatea una respuesta de error
   * @param {string} code - Código del error
   * @param {string} message - Mensaje del error
   * @param {Object} details - Detalles adicionales del error
   * @param {string} path - Path de la petición
   * @returns {Object} Respuesta de error formateada
   */
  static error(code, message, details = {}, path = '') {
    return {
      error: {
        code,
        message,
        details,
        timestamp: new Date().toISOString(),
        path
      }
    };
  }

  /**
   * Formatea una respuesta con paginación
   * @param {Array} data - Datos de la página actual
   * @param {number} page - Página actual
   * @param {number} limit - Elementos por página
   * @param {number} total - Total de elementos
   * @param {string} path - Path de la petición
   * @returns {Object} Respuesta con paginación
   */
  static paginated(data, page, limit, total, path = '') {
    const totalPages = Math.ceil(total / limit);
    
    return {
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      timestamp: new Date().toISOString(),
      path
    };
  }
}

module.exports = ResponseFormatter;