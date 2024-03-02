'use strict';

const path = require('node:path');
const AutoLoad = require('@fastify/autoload');
const cors = require('@fastify/cors');

require('dotenv').config();

// Pass --options via CLI arguments in command to enable these options.
const options = {};

module.exports = async function (fastify, opts) {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts),
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts),
  });

  // https://github.com/fastify/fastify-mongodb
  fastify.register(require('@fastify/mongodb'), {
    // force to close the mongodb connection when app stopped
    // the default value is false
    forceClose: true,
    url: `${process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017'}/${process.env.DATABASE_NAME || 'fintos'}`,
  });

  fastify.register(cors, {
    origin: process.env.WEB_URL || 'http://localhost:3000',
  });
};

module.exports.options = options;
