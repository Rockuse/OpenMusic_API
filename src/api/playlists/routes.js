const routes = (handler) => [
  // ROOT
  {
    method: 'POST',
    path: '/playlists',
    handler: (request, h) => handler.postPlaylist(request, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: (request, h) => handler.getPlaylist(request, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: (request, h) => handler.deletePlaylistById(request, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  // SONGS
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.postPlaylistSongs(request, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.getPlaylistSongById(request, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.deletePlaylistSongById(request, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  // ACTIVITIES
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: (request, h) => handler.getActivities(request, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
