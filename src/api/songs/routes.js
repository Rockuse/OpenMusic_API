const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: (request, h) => handler.postSong(request, h),
  },
  {
    method: 'GET',
    path: '/songs',
    handler: (request, h) => handler.getSong(request, h),
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: (request, h) => handler.getSongById(request, h),
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: (request, h) => handler.putSong(request, h),
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: (request, h) => handler.deleteSong(request, h),
  },
];

module.exports = routes;
