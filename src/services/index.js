const AlbumsService = require('./main/AlbumsServices');
const AuthenticationsService = require('./main/AuthenticationsService');
const SongsService = require('./main/SongsServices');
const UserService = require('./main/UserService');
const PlaylistService = require('./main/PlaylistServices');
const CollaborationServices = require('./main/CollaborationServices');
const ProducerService = require('./rabbitmq/ProducerService');
const StorageService = require('./storage/StorageService');
const CacheService = require('./redis/CacheService');

module.exports = [AlbumsService,
  SongsService,
  UserService,
  AuthenticationsService,
  PlaylistService,
  CollaborationServices,
  ProducerService,
  StorageService,
  CacheService];
