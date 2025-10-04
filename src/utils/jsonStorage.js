const fs = require('fs').promises;
const path = require('path');

/**
 * Clase para manejar operaciones de lectura/escritura en archivos JSON
 */
class JsonStorage {
  constructor(filename) {
    this.filepath = path.join(__dirname, '../../db', filename);
  }

  /**
   * Lee todos los datos del archivo JSON
   * @returns {Promise<Array>} Array con todos los registros
   */
  async read() {
    try {
      const data = await fs.readFile(this.filepath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // Si el archivo no existe, retorna array vacío
        return [];
      }
      throw error;
    }
  }

  /**
   * Escribe datos en el archivo JSON
   * @param {Array} data - Datos a escribir
   * @returns {Promise<boolean>}
   */
  async write(data) {
    try {
      await fs.writeFile(
        this.filepath,
        JSON.stringify(data, null, 2),
        'utf8'
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca un elemento por ID
   * @param {string} id - ID del elemento
   * @returns {Promise<Object|undefined>}
   */
  async findById(id) {
    const data = await this.read();
    return data.find(item => item.id === id);
  }

  /**
   * Busca un elemento según un criterio
   * @param {Object} criteria - Objeto con criterios de búsqueda
   * @returns {Promise<Object|undefined>}
   */
  async findOne(criteria) {
    const data = await this.read();
    return data.find(item => {
      return Object.keys(criteria).every(key => item[key] === criteria[key]);
    });
  }

  /**
   * Crea un nuevo elemento
   * @param {Object} newItem - Datos del nuevo elemento
   * @returns {Promise<Object>} Elemento creado con ID
   */
  async create(newItem) {
    const data = await this.read();
    const item = {
      id: this.generateId(),
      ...newItem,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.push(item);
    await this.write(data);
    return item;
  }

  /**
   * Actualiza un elemento existente
   * @param {string} id - ID del elemento
   * @param {Object} updates - Datos a actualizar
   * @returns {Promise<Object|null>} Elemento actualizado o null si no existe
   */
  async update(id, updates) {
    const data = await this.read();
    const index = data.findIndex(item => item.id === id);
    
    if (index === -1) {
      return null;
    }

    data[index] = {
      ...data[index],
      ...updates,
      id: data[index].id, // Preservar el ID original
      createdAt: data[index].createdAt, // Preservar fecha de creación
      updatedAt: new Date().toISOString()
    };

    await this.write(data);
    return data[index];
  }

  /**
   * Elimina un elemento
   * @param {string} id - ID del elemento
   * @returns {Promise<boolean>} true si se eliminó, false si no existía
   */
  async delete(id) {
    const data = await this.read();
    const filteredData = data.filter(item => item.id !== id);
    
    if (data.length === filteredData.length) {
      return false; // No se encontró el elemento
    }

    await this.write(filteredData);
    return true;
  }

  /**
   * Genera un ID único
   * @returns {string}
   */
  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}

module.exports = JsonStorage;