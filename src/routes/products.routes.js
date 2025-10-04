const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');
const contentNegotiation = require('../middleware/contentNegotiation');

// Middlewares de autenticación (los implementará el Estudiante 1)
// const apiKeyAuth = require('../middleware/apiKeyAuth');
// const jwtAuth = require('../middleware/jwtAuth');
// const roleAuth = require('../middleware/roleAuth');

// Aplicar negociación de contenido a todas las rutas
router.use(contentNegotiation);

/**
 * Rutas públicas (requieren API Key)
 * NOTA: Descomentar apiKeyAuth cuando el Estudiante 1 lo implemente
 */

// GET /products - Listar todos los productos con paginación
router.get('/', 
  // apiKeyAuth,  // ← Descomentar después
  productsController.getAllProducts
);

// GET /products/:id - Obtener un producto por ID
router.get('/:id',
  // apiKeyAuth,  // ← Descomentar después
  productsController.getProductById
);

/**
 * Rutas protegidas (requieren JWT y roles específicos)
 * NOTA: Descomentar jwtAuth y roleAuth cuando el Estudiante 1 los implemente
 */

// POST /products - Crear nuevo producto (requiere rol editor o admin)
router.post('/',
  // jwtAuth,  // ← Descomentar después
  // roleAuth(['editor', 'admin']),  // ← Descomentar después
  productsController.createProduct
);

// PUT /products/:id - Actualizar producto (requiere rol editor o admin)
router.put('/:id',
  // jwtAuth,  // ← Descomentar después
  // roleAuth(['editor', 'admin']),  // ← Descomentar después
  productsController.updateProduct
);

// DELETE /products/:id - Eliminar producto (requiere rol admin)
router.delete('/:id',
  // jwtAuth,  // ← Descomentar después
  // roleAuth(['admin']),  // ← Descomentar después
  productsController.deleteProduct
);

module.exports = router;