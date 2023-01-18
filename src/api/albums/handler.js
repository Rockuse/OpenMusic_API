const autoBind = require('auto-bind');

class Albums {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postAlbum(request, h) {
    this._validator.validateAlbums(request.payload);
    const { name, year } = request.payload;
    const id = this._service.addAlbum({ name, year });
    const response = h.response({
      status: 'success',
      data: { albumid: id },
    });
    response.code(201);
    return response;
  }

  async getAlbum() {
    const album = this._service.getAlbum();
    const response = {
      status: 'success',
      data: album,
    };
    return response;
  }

  async getAlbumById(request, h) {
    const { id } = request.params;
    const album = this._service.getAlbumById(id);
    const response = h.response({
      status: 'success',
      data: { album },
    });
    response.code(200);
    return response;
  }

  async putAlbum(request, h) {
    this._validator.validateAlbums(request.payload);
    const { id } = request.params;
    this._service.editAlbum(id, request.payload);
    const response = h.response({
      status: 'success',
      message: 'Album berhasil diUpdate',
    });
    return response;
  }

  async deleteAlbum(request, h) {
    const { id } = request.params;
    this._service.deleteAlbum(id);
    const response = h.response({
      status: 'success',
      message: 'Album berhasil diHapus',
    });
    return response;
  }
}

module.exports = Albums;
