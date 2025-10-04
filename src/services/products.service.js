const JsonStorage = require('../utils/jsonStorage');
const { validateProduct } = require('../utils/validators');

const productsDB = new JsonStorage('products.json');

/**
 * Servicio de productos - Lógica de negocio
 */
class ProductsService {
  /**
   * Obtener todos los productos con paginación
   */
  async getAllProducts(page = 1, limit = 10) {
    const allProducts = await productsDB.read();
    const total = allProducts.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const products = allProducts.slice(startIndex, endIndex);

    return {
      products,
      total,
      page,
      limit
    };
  }

  /**
   * Obtener un producto por ID
   */
  async getProductById(id) {
    const product = await productsDB.findById(id);
    if (!product) {
      const error = new Error('Product not found');
      error.name = 'NotFoundError';
      throw error;
    }
    return product;
  }

  /**
   * Crear un nuevo producto
   */
  async createProduct(productData) {
    // Validar datos
    const validation = validateProduct(productData);
    if (!validation.valid) {
      const error = new Error('Validation failed');
      error.name = 'ValidationError';
      error.details = validation.errors;
      throw error;
    }

    // Verificar que el SKU no exista
    const existingProduct = await productsDB.findOne({ sku: productData.sku });
    if (existingProduct) {
      const error = new Error('Product with this SKU already exists');
      error.name = 'ConflictError';
      throw error;
    }

    // Crear producto
    const newProduct = await productsDB.create({
      name: productData.name.trim(),
      sku: productData.sku.trim(),
      price: parseFloat(productData.price),
      stock: parseInt(productData.stock),
      category: productData.category.trim(),
      description: productData.description?.trim() || ''
    });

    return newProduct;
  }

  /**
   * Actualizar un producto existente
   */
  async updateProduct(id, productData) {
    // Verificar que el producto existe
    const existingProduct = await productsDB.findById(id);
    if (!existingProduct) {
      const error = new Error('Product not found');
      error.name = 'NotFoundError';
      throw error;
    }

    // Si se está actualizando el SKU, verificar que no exista en otro producto
    if (productData.sku && productData.sku !== existingProduct.sku) {
      const skuExists = await productsDB.findOne({ sku: productData.sku });
      if (skuExists && skuExists.id !== id) {
        const error = new Error('Product with this SKU already exists');
        error.name = 'ConflictError';
        throw error;
      }
    }

    // Validar los datos actualizados
    const dataToValidate = {
      name: productData.name || existingProduct.name,
      sku: productData.sku || existingProduct.sku,
      price: productData.price !== undefined ? productData.price : existingProduct.price,
      stock: productData.stock !== undefined ? productData.stock : existingProduct.stock,
      category: productData.category || existingProduct.category
    };

    const validation = validateProduct(dataToValidate);
    if (!validation.valid) {
      const error = new Error('Validation failed');
      error.name = 'ValidationError';
      error.details = validation.errors;
      throw error;
    }

    // Preparar datos para actualización
    const updates = {};
    if (productData.name) updates.name = productData.name.trim();
    if (productData.sku) updates.sku = productData.sku.trim();
    if (productData.price !== undefined) updates.price = parseFloat(productData.price);
    if (productData.stock !== undefined) updates.stock = parseInt(productData.stock);
    if (productData.category) updates.category = productData.category.trim();
    if (productData.description !== undefined) updates.description = productData.description.trim();

    // Actualizar producto
    const updatedProduct = await productsDB.update(id, updates);
    return updatedProduct;
  }

  /**
   * Eliminar un producto
   */
  async deleteProduct(id) {
    const product = await productsDB.findById(id);
    if (!product) {
      const error = new Error('Product not found');
      error.name = 'NotFoundError';
      throw error;
    }

    const deleted = await productsDB.delete(id);
    return deleted;
  }
}

module.exports = new ProductsService();