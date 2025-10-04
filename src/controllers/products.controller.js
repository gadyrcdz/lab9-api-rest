const productsService = require('../services/products.service');
const ResponseFormatter = require('../utils/responseFormatter');
const { validatePagination } = require('../utils/validators');

/**
 * Controladores de productos
 */

/**
 * GET /products - Obtener todos los productos
 */
const getAllProducts = async (req, res, next) => {
  try {
    const { page, limit } = validatePagination(req.query.page, req.query.limit);
    
    const result = await productsService.getAllProducts(page, limit);
    
    res.status(200).json(
      ResponseFormatter.paginated(
        result.products,
        result.page,
        result.limit,
        result.total,
        req.originalUrl
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /products/:id - Obtener un producto por ID
 */
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productsService.getProductById(id);
    
    res.status(200).json(
      ResponseFormatter.success(
        product,
        'Product retrieved successfully',
        req.originalUrl
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * POST /products - Crear un nuevo producto
 */
const createProduct = async (req, res, next) => {
  try {
    const newProduct = await productsService.createProduct(req.body);
    
    res.status(201).json(
      ResponseFormatter.success(
        newProduct,
        'Product created successfully',
        req.originalUrl
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /products/:id - Actualizar un producto
 */
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedProduct = await productsService.updateProduct(id, req.body);
    
    res.status(200).json(
      ResponseFormatter.success(
        updatedProduct,
        'Product updated successfully',
        req.originalUrl
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /products/:id - Eliminar un producto
 */
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await productsService.deleteProduct(id);
    
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};