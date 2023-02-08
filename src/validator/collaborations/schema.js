const Joi = require('joi');

const collaborationSchema = Joi.object({
  playlistId: Joi.string().required().min(3),
  userId: Joi.string().required().min(2),
});

module.exports = { collaborationSchema };
