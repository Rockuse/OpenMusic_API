const Albums = require('./albums/handler');
const Songs = require('./songs/handler');
const albumsRoutes = require('./albums/routes');
const songsRoutes = require('./songs/routes');

module.exports = [{
  name: 'Albums',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const albumsHandler = new Albums(service, validator);
    server.route(albumsRoutes(albumsHandler));
  },
},
{
  name: 'Songs',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const songsHandler = new Songs(service, validator);
    server.route(songsRoutes(songsHandler));
  },
},
];
