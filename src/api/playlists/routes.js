const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: (request, h) => handler.postPlaylist(request, h),
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: (request, h) => handler.getPlaylist(request, h),
  },
  {
    method: 'GET',
    path: '/playlists/{id}',
    handler: (request, h) => handler.getPlaylistById(request, h),
  },
  {
    method: 'PUT',
    path: '/playlists/{id}',
    handler: (request, h) => handler.putPlaylistById(request, h),
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: (request, h) => handler.deletePlaylistById(request, h),
  },
];

module.exports = routes;
