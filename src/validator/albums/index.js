const InvariantError = require('../../utils/exceptions/InvariantError');
const { AlbumsSchema,AlbumCoverSchema } = require('./schema');

const Validator = {
  validateAlbums: (payload) => {
    const validationResult = AlbumsSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateAlbumCover:(payload)=>{
    const validationResult = AlbumCoverSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
    
  }
  
};
module.exports = Validator;
