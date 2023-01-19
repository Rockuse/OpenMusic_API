const Joi = require('joi');

const AlbumsSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

const SongsSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string(),
});
module.exports = { AlbumsSchema, SongsSchema };
