const AlbumsService = require('./AlbumsServices');
const AuthenticationsService = require('./AuthenticationsService');
const SongsService = require('./SongsServices');
const UserService = require('./UserService');
const PlaylistService = require('./PlaylistServices');

module.exports = [AlbumsService,
  SongsService,
  UserService,
  AuthenticationsService,
  PlaylistService];
