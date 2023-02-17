const Joi = require('joi');

const currentYear = new Date().getFullYear();
const AlbumsSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(currentYear)
    .required(),
});
const AlbumCoverSchema = Joi.object({
  'content-type': Joi.string().valid(
      'image/jpg',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
  ).required(),
}).unknown();

module.exports = { AlbumsSchema, AlbumCoverSchema };
