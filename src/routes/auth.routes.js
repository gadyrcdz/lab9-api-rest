const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const apiKeyAuth = require('../middleware/apiKeyAuth');

/**
 * POST /auth/login
 * Iniciar sesión con email y password
 * Requiere API Key en el header X-API-Key
 * Body: { email, password }
 */
router.post('/login', apiKeyAuth, authController.login);

module.exports = router;