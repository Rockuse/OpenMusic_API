const autoBind = require('auto-bind');
class ExportsHandler {
  constructor(exportsService, playlistsService, validator) {
    this._exportsService = exportsService;
    this._playlistsService = playlistsService;
    this._validator = validator;
    autoBind(this)
  }

  async postExportPlaylist(request, h) {
      this._validator.validateExportPlaylistPayload(request.payload);
      const {id: userId} = request.auth.credentials;

      const {id} = request.params;
      await this._playlistsService.verifyPlaylistOwner(userId,id);

      const message = {
        id,
        targetEmail: request.payload.targetEmail,
      };

      await this._exportsService.sendMessage(
          'export:playlist',
          JSON.stringify(message),
      );

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      });
      response.code(201);
      return response;
  }
}

module.exports = ExportsHandler;