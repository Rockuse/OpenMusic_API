require('dotenv').config();
const Hapi = require('@hapi/hapi');
const ClientError = require('./utils/exceptions/ClientError');
const api = require('./api');
const services = require('./services');
const Validator = require('./validator');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
  const arr = [];
  for (let i = 0; i < api.length; i += 1) {
    const element = {
      plugin: api[i],
      options: {
        service: new services[i](),
        validator: Validator[i],
      },
    };
    arr.push(element);
  }

  await server.register(arr);

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;
    if (response instanceof Error) {
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.continue;
      }
      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }
    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });
  await server.start();
  console.log('server is running');
};

init();
