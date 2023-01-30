const InvariantError = require('../../utils/exceptions/InvariantError');
const { SongsSchema } = require('./schema');

const Validator = {
  validateSongs: (payload) => {
    const validationResult = SongsSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
module.exports = Validator;
