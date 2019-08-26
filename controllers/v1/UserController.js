const baseJoi = require('joi');
const extension = require('joi-date-extensions');
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const mongoose = require('mongoose');
const Mailer = require('../../services/EmailService');
const UserModel = require('../../models/UserModel');
const responseService = require('../../services/ResponseService');

const {
  loginValidateSchema,
} = require('../../schemas/UserSchema');

const Joi = baseJoi.extend(extension);

const isAuthenticated = async (request, response, user) => {
  const authenticated = await bcrypt.compare(request.body.password, user.password);
  if (!authenticated) {
    responseService.response(response, config.RESPONSE.CODE.ERROR, 'Invalid password');
    return false;
  }
  return true;
};

const UserController = {

  login: async (request, response) => {
    try {
      let validation = Joi.validate(request.body, loginValidateSchema);

      if (validation && validation.error) {
        const errorMessage = validation.error.details[0] ? (validation.error.details[0].message || 'not found') : 'not found';
        responseService.response(response, config.RESPONSE.CODE.ERROR, errorMessage);
      } else {
        try {
          const query = {
            status: { $in: ['active'] },
            email: request.body.email,
            type: {
              $in: ['super_admin'],
            }
          };
          const user = await UserModel.findOne(query);
          if (!user) {
            responseService.response(response, config.RESPONSE.CODE.ERROR, 'not found');
          } else {
            const authenticated = await isAuthenticated(request, response, user);
            if (authenticated) {
              /*const tokenData = {
                id: user.id,
                type: user.type,
                firstName: user.firstName,
                lastName: user.lastName,
                facility: user.facility,
              };*/
              const token =  jwt.sign({ _id: user.id.toString() },'name-directory', { expiresIn: '7 days'});
              const responseUser = user.toObject();
              delete responseUser.password;
              delete responseUser.passwordResetToken;
              delete responseUser.passwordResetRequestTime;
              const result = { user: responseUser, token };
              user.tokens = user.tokens.concat({ token })
              await user.save();
              responseService.response(response, config.RESPONSE.CODE.SUCCESS, result);
            }
          }
        } catch (error) {
          responseService.response(response, config.RESPONSE.CODE.ERROR, error.message);
        }
      }
    } catch (error) {
      responseService.error(response, error);
    }
  },

  logout: async (request, response) => {
    const user = await UserModel.findOne({_id : request.body.user_id});
    user.tokens = user.tokens.filter((token) =>{
      return token.token !== request.token
    });
    await user.save();
    responseService.response(response, config.RESPONSE.CODE.SUCCESS, 'User removed');
  },

  getProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await UserModel.findOne({ _id: id });
      responseService.response(res, config.RESPONSE.CODE.SUCCESS, user);
    } catch (error) {
      responseService.response(res, config.RESPONSE.CODE.ERROR, error);
    }
  },
};

module.exports = UserController;
