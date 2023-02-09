const autoBind = require('auto-bind');
const SongsService = require('../../services/SongsServices');

class PlaylistHandler {
  constructor(service, validator) {
    this._service = service;
    this._songService = new SongsService();
    this._validator = validator;
    autoBind(this);
  }

  // ----- Playlist ------
  async postPlaylist(request, h) {
    const { id: credentialId } = request.auth.credentials;
    request.payload.owner = credentialId;
    await this._validator.validatePlaylist(request.payload);
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
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getAllPlaylist(credentialId);
    const res = h.response({
      status: 'success',
      data: { playlists },
    });
    return res;
  }

  async deletePlaylistById(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;
    await this._service.verifyPlaylistAccess(credentialId, id, true);
    await this._service.deletePlaylist(id);
    const res = h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    });
    return res;
  }

  // ----- SONGS ------
  async postPlaylistSongs(request, h) {
    const temp = { ...request.payload, ...request.params };
    await this._validator.validatePlaylistSong(temp);
    const { id: credentialId } = request.auth.credentials;
    temp.credentialId = credentialId;
    await this._songService.getSongById(temp.songId);
    await this._service.verifyPlaylistAccess(credentialId, temp.id);
    const playListId = await this._service.addSongToPlaylist(temp);
    const res = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: { playListId },
    });
    res.code(201);
    return res;
  }

  async getPlaylistSongById(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;
    await this._service.verifyPlaylistAccess(credentialId, id);
    const playlist = await this._service.getSongsFromPlaylist(id);
    const res = h.response({
      status: 'success',
      data: playlist,
    });
    return res;
  }

  async deletePlaylistSongById(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;
    const { songId } = request.payload;
    await this._service.verifyPlaylistAccess(credentialId, id);
    await this._service.deleteSongFromPlaylist(id, songId, credentialId);
    const res = h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    });
    return res;
  }

  // ----- ACTIVITIES ------
  async getActivities(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;
    await this._service.verifyPlaylistAccess(credentialId, id);
    const activities = await this._service.getPlaylistActivities(id);
    const res = h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
      data: { ...activities },
    });
    return res;
  }
}
module.exports = PlaylistHandler;
