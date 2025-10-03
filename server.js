require('dotenv').config();
const app = require('./src/app');
const config = require('./src/config/config');

const PORT = config.port;

app.listen(PORT, () => {
  console.log('================================================');
  console.log(' Server running on port ' + PORT);
  console.log(' Environment: ' + config.nodeEnv);
  console.log(' API Base URL: http://localhost:' + PORT + '/api');
  console.log('================================================');
  console.log(' Endpoints disponibles:');
  console.log('  POST   /api/auth/login');
  console.log('  GET    /api/products');
  console.log('  GET    /api/products/:id');
  console.log('  POST   /api/products');
  console.log('  PUT    /api/products/:id');
  console.log('  DELETE /api/products/:id');
  console.log('================================================');
});