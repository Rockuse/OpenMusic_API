const path = require('path')
const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: (request, h) => handler.postAlbum(request, h),
  },
  {
    method: 'GET',
    path: '/albums',
    handler: () => handler.getAlbum(),
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: (request, h) => handler.getAlbumById(request, h),
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: (request, h) => handler.putAlbum(request, h),
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: (request, h) => handler.deleteAlbum(request, h),
  },
  // V3
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: (request, h) =>handler.postAlbumCover(request, h),
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000,
      },
    },
  },
  {
    method: 'GET',
    path: '/upload/images/{param*}',
    handler: {
      directory: {
        path: path.join(__dirname, '/file/images'),
      },
    },
  },
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: (request, h) =>handler.postLikeAlbumById(request, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler:(request, h) => handler.getAlbumLikesById(request, h),
  },
];

module.exports = routes;
