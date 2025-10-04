const xml2js = require('xml2js');

/**
 * Middleware de negociación de contenido
 * Convierte respuestas JSON a XML según el header Accept
 */
const contentNegotiation = (req, res, next) => {
  const originalJson = res.json.bind(res);

  res.json = function(data) {
    const acceptHeader = req.headers.accept || '';

    // Si el cliente acepta XML
    if (acceptHeader.includes('application/xml') || acceptHeader.includes('text/xml')) {
      const builder = new xml2js.Builder({
        rootName: 'response',
        xmldec: { version: '1.0', encoding: 'UTF-8' }
      });

      try {
        const xmlData = builder.buildObject(data);
        res.set('Content-Type', 'application/xml');
        return res.send(xmlData);
      } catch (error) {
        console.error('Error converting to XML:', error);
        // Si falla la conversión, devolver JSON
        return originalJson(data);
      }
    }

    // Por defecto, devolver JSON
    return originalJson(data);
  };

  next();
};

module.exports = contentNegotiation;