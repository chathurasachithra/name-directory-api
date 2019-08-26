const baseJoi = require('joi');
const extension = require('joi-date-extensions');

const Joi = baseJoi.extend(extension);

const newNameValidateSchema = Joi.object().keys({

  name: Joi.string().required(),
  meaning: Joi.string().required(),
  views: Joi.number().allow(null).allow(''),
  similar_names: Joi.string().allow(null).allow(''),
  gender: Joi.string().allow(null).allow(''),
  status: Joi.string().allow(null).allow(''),
  categories: Joi.array().allow(null).allow(''),
  languages: Joi.array().allow(null).allow(''),
});

const updateNameValidateSchema = Joi.object().keys({
  name: Joi.string().required(),
  meaning: Joi.string().required(),
  views: Joi.number().allow(null).allow(''),
  similar_names: Joi.string().allow(null).allow(''),
  gender: Joi.string().allow(null).allow(''),
  status: Joi.string().allow(null).allow(''),
  categories: Joi.array().allow(null).allow(''),
  languages: Joi.array().allow(null).allow(''),
});

module.exports = {
  newNameValidateSchema,
  updateNameValidateSchema,
};
