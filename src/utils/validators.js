/**
 * Utilidades de validación para productos
 */

/**
 * Valida los datos de un producto
 * @param {Object} productData - Datos del producto a validar
 * @returns {Object} { valid: boolean, errors: Object }
 */
const validateProduct = (productData) => {
  const errors = {};

  // Validar name (requerido, mínimo 3 caracteres)
  if (!productData.name || productData.name.trim() === '') {
    errors.name = 'Name is required';
  } else if (productData.name.trim().length < 3) {
    errors.name = 'Name must be at least 3 characters long';
  }

  // Validar SKU (requerido, mínimo 5 caracteres)
  if (!productData.sku || productData.sku.trim() === '') {
    errors.sku = 'SKU is required';
  } else if (productData.sku.trim().length < 5) {
    errors.sku = 'SKU must be at least 5 characters long';
  }

  // Validar price (requerido, debe ser número > 0)
  if (productData.price === undefined || productData.price === null) {
    errors.price = 'Price is required';
  } else {
    const price = parseFloat(productData.price);
    if (isNaN(price)) {
      errors.price = 'Price must be a valid number';
    } else if (price <= 0) {
      errors.price = 'Price must be greater than 0';
    }
  }

  // Validar stock (requerido, debe ser número >= 0)
  if (productData.stock === undefined || productData.stock === null) {
    errors.stock = 'Stock is required';
  } else {
    const stock = parseInt(productData.stock);
    if (isNaN(stock)) {
      errors.stock = 'Stock must be a valid number';
    } else if (stock < 0) {
      errors.stock = 'Stock must be greater than or equal to 0';
    }
  }

  // Validar category (requerido)
  if (!productData.category || productData.category.trim() === '') {
    errors.category = 'Category is required';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Valida los parámetros de paginación
 * @param {*} page - Número de página
 * @param {*} limit - Límite de elementos por página
 * @returns {Object} { page: number, limit: number }
 */
const validatePagination = (page, limit) => {
  let validPage = parseInt(page) || 1;
  let validLimit = parseInt(limit) || 10;

  // Asegurar valores mínimos y máximos
  validPage = Math.max(1, validPage);
  validLimit = Math.max(1, Math.min(100, validLimit)); // Máximo 100 elementos

  return { page: validPage, limit: validLimit };
};

module.exports = {
  validateProduct,
  validatePagination
};