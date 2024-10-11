const swaggerJsDoc = require('swagger-jsdoc');
const pkg = require('../package.json');
/**
 * Options du swagger
 * @type {{
 *    apis: [string],
 *    definition: {
 *      info: {servers: [string], contact: {name: string}, title: string, version: string}
 *    }
 * }}
 */
const options = {
  swaggerDefinition: {
    openapi: '3.0.3',
    info: {
      title: pkg.name,
      version: pkg.version,
      description: pkg.description,
      contact: {
        name: pkg.author,
        email: pkg.contact,
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: ['app.js', 'controllers/*.controller.js'],
};

module.exports = swaggerJsDoc(options);
