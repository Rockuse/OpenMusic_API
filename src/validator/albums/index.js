const InvariantError = require('../../utils/exceptions/InvariantError');
const { AlbumsSchema } = require('./schema');

const Validator = {
  validateAlbums: (payload) => {
    const validationResult = AlbumsSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
module.exports = Validator;
