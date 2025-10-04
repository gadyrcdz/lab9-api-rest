const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JsonStorage = require('../utils/jsonStorage');
const config = require('../config/config');

const usersDB = new JsonStorage('users.json');

/**
 * Servicio de autenticación
 */
class AuthService {
  /**
   * Iniciar sesión con email y password
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<Object>} Token y datos del usuario
   */
  async login(email, password) {
    // Validar que se proporcionen email y password
    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.status = 400;
      throw error;
    }

    // Buscar usuario por email
    const user = await usersDB.findOne({ email: email.toLowerCase() });

    if (!user) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    // Verificar la contraseña - USAR compareSync en lugar de compare
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    // Generar JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      config.jwt.secret,
      {
        expiresIn: config.jwt.expiresIn
      }
    );

    // Retornar token y datos del usuario (sin password)
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    };
  }

  /**
   * Verificar un token JWT
   * @param {string} token - Token JWT
   * @returns {Promise<Object>} Datos del usuario decodificados
   */
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}

module.exports = new AuthService();