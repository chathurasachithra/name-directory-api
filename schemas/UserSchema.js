const baseJoi = require('joi');
const extension = require('joi-date-extensions');
const ConstantsService = require('../services/ConstantsService');

const Joi = baseJoi.extend(extension);

const loginValidateSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required()
});

module.exports = {
  loginValidateSchema,
};
