const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const productsRoutes = require('./routes/products.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares de seguridad
app.use(helmet());
app.use(cors());

// Middlewares de parseo
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
app.use(morgan('dev'));

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API REST - Laboratorio 9',
    version: '1.0.0',
    documentation: 'Ver colección de Postman en /docs',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products'
    },
    note: 'Recuerda incluir API Key en el header X-API-Key para endpoints públicos'
  });
});

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
      details: {
        method: req.method,
        url: req.originalUrl
      },
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    }
  });
});

// Middleware de manejo de errores (siempre al final)
app.use(errorHandler);

module.exports = app;