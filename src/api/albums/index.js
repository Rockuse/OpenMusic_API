const Albums = require('./handler');
const albumsRoutes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const albumsHandler = new Albums(service, validator);
    server.route(albumsRoutes(albumsHandler));
  },
};
