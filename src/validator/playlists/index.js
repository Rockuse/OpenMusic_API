const InvariantError = require('../../utils/exceptions/InvariantError');
const { PlaylistSchema, PlaylistSongsSchema } = require('./schema');

const validator = {
  validatePlaylist: (payload) => {
    const validationResult = PlaylistSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePlaylistSong: (payload) => {
    const validationResult = PlaylistSongsSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = validator;
