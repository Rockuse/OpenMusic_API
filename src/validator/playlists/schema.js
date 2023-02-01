const Joi = require('joi');

const PlaylistSchema = Joi.object({
  name: Joi.string().min(4).max(255).required(),
  owner: Joi.string().min(4).max(255).required(),
});
module.exports = PlaylistSchema;
