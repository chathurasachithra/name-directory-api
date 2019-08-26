const config = require('config');
const baseJoi = require('joi');
const extension = require('joi-date-extensions');
const mongoose = require('mongoose');

const Joi = baseJoi.extend(extension);
const ConstantsService = require('../services/ConstantsService');
const NameModel = require('../models/NameModel');
const LanguageModel = require('../models/LanguageModel');
const CategoryModel = require('../models/CategoryModel');
const { newNameValidateSchema, updateNameValidateSchema } = require('../schemas/NameSchema');

const NameService = {

  save: async (request) => {
    const validation = Joi.validate(request, newNameValidateSchema);
    if (validation.error) {
      let errorMessage = validation.error.details.shift();
      errorMessage = errorMessage.message || ConstantsService.name.inputValidationError;
      throw new Error(errorMessage);
    }
    const name = {
      name: request.name,
      meaning: request.meaning,
      similar_names: request.similar_names,
      gender: request.gender,
      categories: request.categories,
      languages: request.languages,
    };
    const nameResponse = await NameModel.create(name);
    return nameResponse;
  },

  update: async (request, nameId) => {
    const currentName = await NameModel.findOne({ _id: nameId });
    if (!currentName) {
      throw new Error('Cannot find a name for this Id');
    }
    const validation = Joi.validate(request, updateNameValidateSchema);
    if (validation.error) {
      let errorMessage = validation.error.details.shift();
      errorMessage = errorMessage.message || ConstantsService.name.inputValidationError;
      throw new Error(errorMessage);
    }
    const name = {
      name: request.name,
      meaning: request.meaning,
      similar_names: request.similar_names,
      gender: request.gender,
      categories: request.categories,
      languages: request.languages,
    };
    const nameResponse = await NameModel.findOneAndUpdate(
      { _id: nameId },
      { $set: name },
      { new: true },
    );
    return nameResponse;
  },

  remove: async (nameId) => {
    const currentName = await NameModel.findOne({ _id: nameId });
    if (!currentName) {
      throw new Error('Cannot find a name for this Id');
    }
    const name = {
      status: 'removed',
    };
    const nameResponse = await NameModel.findOneAndUpdate(
      { _id: nameId },
      { $set: name },
      { new: true },
    );
    return nameResponse;
  },

  getList: async (request) => {
    const { sort } = request;
    let {
      limit, offset, search,
    } = request;
    limit = parseInt(limit, 10) || 20;
    offset = parseInt(offset, 10) || 0;

    const searchQuery = { status: { $ne: 'removed' } };
    if (search && search !== '') {
      search = search.trim().toLowerCase();
      const queryString = new RegExp(search.trim()
        .toLowerCase()
        .replace(/([.*+?=^!:${}()|[\]\/\\])/g, '\\$1'), 'i');
      searchQuery.name = { $regex: queryString };
    }
    let sortQuery = sort && sort.field && { [sort.field]: sort.order };
    sortQuery = sortQuery || { name: 1 };
console.log(sortQuery);
    const total = await NameModel.count(searchQuery);
    let names = await NameModel.aggregate([
      { $match: searchQuery },
      {
        $project: {
          _id: '$_id',
          name: '$name',
          meaning: '$meaning',
          views: '$views',
          similar_names: '$similar_names',
          gender: '$gender',
          status: '$status',
          createdAt: '$createdAt',
        },
      },
      {
        $sort: sortQuery,
      },
      {
        $skip: offset,
      },
      {
        $limit: limit,
      },
    ]).exec();

    return { names, total };
  },

  getById: async (nameId) => {
    const name = await NameModel.findOne({ _id: nameId })
      .exec();
    return name;
  },

  getStaticData: async () => {
    const sort = { name: 1 };
    const languages = await LanguageModel.find({}).sort(sort);
    const categories = await CategoryModel.find({}).sort(sort);
    return { languages, categories };
  },

};

module.exports = NameService;
