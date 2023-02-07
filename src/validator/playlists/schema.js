const Joi = require('joi');

const PlaylistSchema = Joi.object({
  name: Joi.string().min(4).max(255).required(),
  owner: Joi.string().min(4).max(255).required(),
});

const PlaylistSongsSchema = Joi.object({
  songId: Joi.string().required(),
});
module.exports = { PlaylistSchema, PlaylistSongsSchema };
