const Songs = require('./handler');
const songsRoutes = require('./routes');

module.exports = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const songsHandler = new Songs(service, validator);
    server.route(songsRoutes(songsHandler));
  },
};
