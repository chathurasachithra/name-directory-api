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

  getAll: async (request) => {
    let {
      category, search, character,
    } = request;
    const searchQuery = { status: { $ne: 'removed' } };
    let categoryName = '';
    if (search && search !== '') {
      search = search.trim().toLowerCase();
      const queryString = new RegExp(search.trim()
        .toLowerCase()
        .replace(/([.*+?=^!:${}()|[\]\/\\])/g, '\\$1'), 'i');
      searchQuery.name = { $regex: queryString };
    }
    if (category && category !== '') {
      const categoryObj = await CategoryModel.findOne({ key: category });
      categoryName = categoryObj;
      const nameIdList = await NameModel.aggregate([
        {
          $unwind: {
            path: '$categories',
            preserveNullAndEmptyArrays: true,
          },
        },
        { $match: { categories: categoryObj._id.toString() } },
        {
          $group:{_id:null, array:{$push:"$_id"}}
        },
        {
          $project:{ array:true, _id:false }
        },
      ]);
      const nameArray = nameIdList.shift();
      if (nameArray && nameArray.array) {
        searchQuery._id = { $in: nameArray.array };
      }
    }
    if (character && character !== '') {
      character = character.trim().toLowerCase();
      const characterString = new RegExp('^' + character.trim()
        .toLowerCase()
        .replace(/([.*+?=^!:${}()|[\]\/\\])/g, '\\$1'), 'i');
      console.log(characterString);
      searchQuery.name = { $regex: characterString };
    }
    const sortQuery = { name: 1 };
    let names = await NameModel.aggregate([
      { $match: searchQuery },
      {
        $project: {
          _id: '$_id',
          name: '$name',
          meaning: '$meaning',
          views: '$views',
          similar_names: '$similar_names',
          languages: '$languages',
          gender: '$gender',
          categories: '$categories',
          status: '$status',
          createdAt: '$createdAt',
        },
      },
      {
        $sort: sortQuery,
      },
    ]).exec();
    let languages = await LanguageModel.find({}).sort({ name: 1 });
    const languageArray = languages.reduce(function(map, obj) {
      map[obj._id] = obj.name;
      return map;
    }, {});
    return { names, categoryName, languages: languageArray };
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

  updateViews: async (name) => {
    const currentName = await NameModel.findOne({ name });
    if (!currentName) {
      throw new Error('Cannot find a name for this name');
    }
    const nameObj = {
      views: currentName.views + 1,
    };
    const nameResponse = await NameModel.findOneAndUpdate(
      { _id: currentName._id },
      { $set: nameObj },
      { new: true },
    );
    return nameResponse;
  },

};

module.exports = NameService;
