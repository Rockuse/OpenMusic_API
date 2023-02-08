const InvariantError = require('../../utils/exceptions/InvariantError');
const { collaborationSchema } = require('./schema');

const validator = {
  validateCollaborations: (payload) => {
    const validationResult = collaborationSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = validator;
