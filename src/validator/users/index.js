const InvariantError = require('../../utils/exceptions/InvariantError');
const { UserSchema } = require('./schema');

const Validator = {
  validateUserPayload: (payload) => {
    const validationResult = UserSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = Validator;
