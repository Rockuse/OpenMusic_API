// eslint-disable-next-line import/no-extraneous-dependencies
const autoBind = require('auto-bind');

class Songs {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postSong(request, h) {
    await this._validator.validateSongs(request.payload);
    const id = await this._service.addSong(request.payload);
    const response = h.response({
      status: 'success',
      data: { songId: id },
    });
    response.code(201);
    return response;
  }

  async getSong(request, h) {
    const { title, performer } = request.query;
    const songs = await this._service.getSong(title, performer);
    const response = h.response({
      status: 'success',
      data: { songs },
    });
    response.code(200);
    return response;
  }

  async getSongById(request, h) {
    const { id } = request.params;
    const { title, performer } = request.query;

    const song = await this._service.getSongById(id, title, performer);
    const response = h.response({
      status: 'success',
      data: { song },
    });
    response.code(200);
    return response;
  }

  async putSong(request, h) {
    await this._validator.validateSongs(request.payload);
    const { id } = request.params;
    await this._service.editSongById(id, request.payload);
    const response = h.response({
      status: 'success',
      message: 'lagu berhasil diubah',
    });
    response.code(200);
    return response;
  }

  async deleteSong(request, h) {
    const { id } = request.params;
    await this._service.deleteSongById(id);
    const response = h.response({
      status: 'success',
      message: 'lagu berhasil dihapus',
    });
    response.code(200);
    return response;
  }
}

module.exports = Songs;
