const autoBind = require('auto-bind');

class PlaylistHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postPlaylist(request, h) {
    await this._validator.validatePlaylist(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const id = await this._service.addPlaylist({ name, credentialId });
    const res = h.response({
      status: 'success',
      data: {
        playlistId: id,
      },
    });
    res.code(201);
    return res;
  }

  async getPlaylist(request, h) {

  }

  async deletePlaylistById(request, h) {

  }

  async postPlaylistSongs(request, h) {

  }

  async putPlaylistSongById(request, h) {

  }

  async deletePlaylistSongById(request, h) {

  }
}
module.exports = PlaylistHandler;
