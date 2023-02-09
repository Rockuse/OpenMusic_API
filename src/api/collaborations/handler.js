const autoBind = require('auto-bind');
const ClientError = require('../../utils/exceptions/ClientError');

class CollaborationsHandler {
  constructor(collaborationsService, playlistService, validator, userService) {
    this._collaborationsService = collaborationsService;
    this._playlistService = playlistService;
    this._validator = validator;
    this._userService = userService;
    autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    this._validator.validateCollaborations(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;
    await this._playlistService.verifyPlaylistOwner(credentialId, playlistId);
    await this._userService.getUserById(userId);
    const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborations(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { playlistId, userId } = request.payload;

      await this._playlistService.verifyPlaylistOwner(credentialId, playlistId);
      await this._collaborationsService.deleteCollaborations(playlistId, userId);

      return {
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.log(error);
      return response;
    }
  }
}

module.exports = CollaborationsHandler;
