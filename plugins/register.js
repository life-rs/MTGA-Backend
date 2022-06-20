'use strict'
const fp = require('fastify-plugin');

module.exports = fp(async function (app, opts) {

  /**
   * Adds compression utils to the Fastify reply object 
   * and a hook to decompress requests payloads. 
   * Supports gzip, deflate, and brotli.
   * @see https://github.com/fastify/fastify-compress
   */
  await app.register(require('@fastify/compress'),
    {
      inflateIfDeflated: true
    });
  app.log.info("@fastify/compress is enabled");


  /**
   * A plugin for Fastify that adds support 
   * for reading and setting cookies.
   * @see https://github.com/fastify/fastify-cookie
  */
  await app.register(require("@fastify/cookie"), {
    secret: 'urmomisawesome',
    parseOptions: {}
  })
  app.log.info('@fastify/cookie is enabled')

  /**
   * A simple plugin for Fastify that adds a content type parser 
   * for the content type application/x-www-form-urlencoded.
   * @see https://github.com/fastify/fastify-formbody
   */
  await app.register(require('@fastify/formbody'))
  app.log.info('@fastify/formbody is enabled')

  app.post(`/`, (request, reply) => {
    reply.send(request.body)
  })

  /**
* Register Handler
*/
  await app.register(require('./router.js'))
  app.log.info('Handler registered');
})