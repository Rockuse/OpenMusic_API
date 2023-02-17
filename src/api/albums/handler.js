// eslint-disable-next-line import/no-extraneous-dependencies
const autoBind = require('auto-bind');
const StorageService = require('../../services/storage/StorageService');
const config = require('../../utils/config')
class Albums {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this._storageService=new StorageService()
    autoBind(this);
  }

  async postAlbum(request, h) {
    await this._validator.validateAlbums(request.payload);
    const { name, year } = request.payload;
    const id = await this._service.addAlbum({ name, year });
    const response = h.response({
      status: 'success',
      data: { albumId: id },
    });
    response.code(201);
    return response;
  }

  async getAlbum() {
    console.log('masuk');
    const album = await this._service.getAlbum();
    console.log('masuk1');
    const response = {
      status: 'success',
      data: album,
    };
    return response;
  }

  async getAlbumById(request, h) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    const response = h.response({
      status: 'success',
      data: { album },
    });
    response.code(200);
    return response;
  }

  async putAlbum(request, h) {
    await this._validator.validateAlbums(request.payload);
    const { id } = request.params;
    await this._service.editAlbum(id, request.payload);
    const response = h.response({
      status: 'success',
      message: 'Album berhasil diUpdate',
    });
    return response;
  }

  async deleteAlbum(request, h) {
    const { id } = request.params;
    await this._service.deleteAlbum(id);
    const response = h.response({
      status: 'success',
      message: 'Album berhasil diHapus',
    });
    return response;
  }

  // V3
  async postAlbumCover(request, h) {
      const {id} = request.params;
      const {cover} = request.payload;
      console.log(id)
      this._validator.validateAlbumCover(cover.hapi.headers);

      const filename = await this._storageService.writeFile(cover, cover.hapi);
      const url = `http://${config.app.host}:${config.app.port}/upload/images/${filename}`;
      await this._service.editAlbumCoverById(id, url);

      const response = h.response({
        status: 'success',
        message: 'Sampul berhasil diunggah',
      });
      response.code(201);
      return response;
  }

  async postLikeAlbumById(request, h) {
      const {id} = request.params;
      const {id: credentialId} = request.auth.credentials;

      await this._service.getAlbumById(id);
      await this._service.addAlbumLikeById(id, credentialId);

      const response = h.response({
        status: 'success',
        message: 'Operasi berhasil dilakukan',
      });
      response.code(201);
      return response;
  }

  async getAlbumLikesById(request, h) {
      const {id} = request.params;
      const {cache, likes} = await this._service.getAlbumLikesById(id);

      const response = h.response({
        status: 'success',
        data: {
          likes,
        },
      });

      if (cache) response.header('X-Data-Source', 'cache');

      return response;
  }
// V3

}

module.exports = Albums;
