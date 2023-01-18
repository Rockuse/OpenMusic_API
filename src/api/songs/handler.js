const autoBind = require('auto-bind');
const idGenerator = require('../../utils/generator');

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

  async getSong() {
    const songs = await this._service.getSong();
    return {
      status: 'success',
      data: songs,
    };
  }

  async getSongById() {
    const songs = await this._service.getSong();
    return {
      status: 'success',
      data: songs,
    };
  }
}

module.exports = Songs;
