const autoBind = require('auto-bind');
const SongsService = require('../../services/SongsServices');

class PlaylistHandler {
  constructor(service, validator) {
    this._service = service;
    this._songService = new SongsService();
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
      const playlists = await this._service.getAllPlaylist(credentialId);
      const res = h.response({
        status: 'success',
        data: { playlists },
      });
      return res;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async deletePlaylistById(request, h) {

  }

  async postPlaylistSongs(request, h) {
    const temp = { ...request.payload, ...request.query };
    await this._validator.validatePlaylistSong(temp);
    const { id: credentialId } = request.auth.credentials;
    console.log(request);
    await this._songService.getSongById(temp.songId);
    await this._service.verifyPlaylistAccess(credentialId, temp.id);
    const id = await this._service.addSongToPlaylist(temp);
    const res = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: { id },
    });
    res.code(201);
    return res;
  }

  async putPlaylistSongById(request, h) {

  }

  async deletePlaylistSongById(request, h) {

  }
}
module.exports = PlaylistHandler;
