const Joi = require('joi');

const UserSchema = Joi.object({
  username: Joi.string().required().max(50).min(4),
  password: Joi.string().required().max(50).min(4),
  fullname: Joi.string().required(),
});

module.exports = { UserSchema };
