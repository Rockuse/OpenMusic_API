const { response } = require('@hapi/hapi/lib/validation');
const autoBind = require('auto-bind');

class PlaylistHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postPlaylist(request, h) {
    const { id: credentialId } = request.auth.credentials;
    request.payload.owner = credentialId;
    await this._validator.validatePlaylist(request.payload);
    // console.log(request.payload);
    const { name } = request.payload;
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
    try {
      const { id: credentialId } = request.auth.credentials;
      await this._service.verifyPlaylistAccess({ credentialId });
      const playlists = await this._service.getAllPlaylist({ credentialId });
      const res = h.response({
        status: 'success',
        data: { playlists },
      });
      return res;
    } catch (error) {
      console.log(error);
    }
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
