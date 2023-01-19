const InvariantError = require('../utils/exceptions/InvariantError');
const { AlbumsSchema, SongsSchema } = require('./schema');

const Validator = [
  {
    validateAlbums: (payload) => {
      const validationResult = AlbumsSchema.validate(payload);
      if (validationResult.error) {
        throw new InvariantError(validationResult.error.message);
      }
    },
  },
  {
    validateSongs: (payload) => {
      const validationResult = SongsSchema.validate(payload);
      if (validationResult.error) {
        throw new InvariantError(validationResult.error.message);
      }
    },
  }];
module.exports = Validator;
